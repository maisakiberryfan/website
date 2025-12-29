// Local JS imports (bundled)
import $ from 'jquery'
import * as bootstrap from 'bootstrap'
import { TabulatorFull as Tabulator } from 'tabulator-tables'
import { marked } from 'marked'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Fancybox } from '@fancyapps/ui'

// Local CSS imports (bundled)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'select2/dist/css/select2.min.css'
import '@fancyapps/ui/dist/fancybox/fancybox.css'
import '../css/tabulator-bootstrap5-custom.css'

// API configuration
import { API_CONFIG, apiRequest, loadingManager, showError } from '../../config.js'

// Expose globals for libraries expecting window bindings
window.$ = window.jQuery = $
window.bootstrap = bootstrap
window.Tabulator = Tabulator
window.marked = marked
window.dayjs = dayjs
window.Fancybox = Fancybox

let fancyboxPromise
window.loadFancybox = async () => {
  if (window.Fancybox) return window.Fancybox
  if (!fancyboxPromise) {
    fancyboxPromise = import('@fancyapps/ui').then(mod => {
      const fb = mod.Fancybox || mod.default || mod
      window.Fancybox = fb
      return fb
    })
  }
  return fancyboxPromise
}

// Load select2 after jQuery is set on window (plugin expects global jQuery)
{
  const mod = await import('select2/dist/js/select2.full.js')
  // In case the module exports a factory instead of self-registering, bind it to our jQuery
  if (!$.fn.select2) {
    const maybeFactory = mod?.default || mod
    if (typeof maybeFactory === 'function') {
      maybeFactory($)
    }
  }
}

// Load dayjs UTC plugin
dayjs.extend(utc)

//------  coding by hand  ------
// ============================================
// Navigation Configuration System
// ============================================
let navConfig = null
let currentLang = localStorage.getItem('lang') || 'zh'

// Get label based on current language
function getLabel(item) {
  if (currentLang === 'ja' && item.labelJa) {
    return item.labelJa
  }
  if (currentLang === 'en' && item.labelEn) {
    return item.labelEn
  }
  return item.label || ''
}

// Load nav configuration from JSON
async function loadNavConfig() {
  if (navConfig) return navConfig
  const response = await fetch('/assets/data/nav.json')
  navConfig = await response.json()
  return navConfig
}

// Build dropdown menu
function buildDropdown(item) {
  const icon = item.icon ? ` <i class="${item.icon}"></i>` : ''
  const label = getLabel(item)
  const menuItems = item.items.map(sub => {
    if (sub.divider) return '<li><hr class="dropdown-divider"></li>'
    const subLabel = getLabel(sub)
    const classes = sub.external ? 'dropdown-item' : 'dropdown-item setContent'
    const ext = sub.ext !== undefined ? `data-ext="${sub.ext}"` : ''
    const target = sub.external ? 'target="_blank"' : ''
    return `<li><a class="${classes}" href="${sub.href}" ${ext} ${target}>${subLabel}</a></li>`
  }).join('')

  return `
    <li class="nav-item dropdown">
      <button class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">${label}${icon}</button>
      <ul class="dropdown-menu">${menuItems}</ul>
    </li>`
}

// Build single nav item
function buildNavItem(item) {
  const icon = item.icon ? ` <i class="${item.icon}"></i>` : ''
  const label = getLabel(item)
  const target = item.external ? 'target="_blank"' : ''
  const classes = item.external ? 'nav-link px-2' : 'nav-link px-2 setContent'
  const ext = item.ext !== undefined ? `data-ext="${item.ext}"` : ''
  const borderClass = item.borderStart ? ' border-start ps-2 ms-2' : ''

  return `
    <li class="nav-item${borderClass}">
      <a class="${classes}" href="${item.href}" ${ext} ${target}>${label ? `<span>${label}</span>` : ''}${icon}</a>
    </li>`
}

// Build language switch dropdown
function buildLangSwitch() {
  const langs = [
    { code: 'zh', label: '中文', flag: '🇹🇼' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' }
  ]
  const current = langs.find(l => l.code === currentLang) || langs[0]
  const options = langs.map(l =>
    `<li><a class="dropdown-item lang-option${l.code === currentLang ? ' active' : ''}" href="#" data-lang-code="${l.code}">${l.flag} ${l.label}</a></li>`
  ).join('')

  return `
    <div class="dropdown ms-3">
      <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="langDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        ${current.flag} ${current.label}
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="langDropdown">
        ${options}
      </ul>
    </div>`
}

// Update page content language (for elements with data-lang attribute)
function updatePageLang() {
  $('[data-lang]').each(function() {
    const lang = $(this).attr('data-lang')
    if (lang === currentLang) {
      $(this).removeClass('d-none')
    } else {
      $(this).addClass('d-none')
    }
  })
  // Update select options with data-zh/data-en/data-ja attributes
  $('option[data-zh], option[data-en], option[data-ja]').each(function() {
    const $opt = $(this)
    const text = $opt.attr(`data-${currentLang}`) || $opt.attr('data-zh') || $opt.text()
    $opt.text(text)
  })
  // Update input placeholders with data-placeholder-zh/en/ja attributes
  $('input[data-placeholder-zh], input[data-placeholder-en], input[data-placeholder-ja], textarea[data-placeholder-zh], textarea[data-placeholder-en], textarea[data-placeholder-ja]').each(function() {
    const $input = $(this)
    const placeholder = $input.attr(`data-placeholder-${currentLang}`) || $input.attr('data-placeholder-zh') || $input.attr('placeholder')
    $input.attr('placeholder', placeholder)
  })
}

// Translation helper function - supports multiple calling patterns
// 1. Object: t({ zh: '中文', en: 'English', ja: '日本語' })
// 2. Three params: t('中文', 'English', '日本語')
// 3. Two params: t('中文', 'English') - generates bilingual spans
function t(arg1, arg2 = null, arg3 = null) {
  // Object form - return text directly
  if (typeof arg1 === 'object') {
    return arg1[currentLang] || arg1.zh || ''
  }

  // Three-parameter form (zh, en, ja) - return text directly
  if (arg3 !== null) {
    if (currentLang === 'ja') return arg3
    if (currentLang === 'en') return arg2
    return arg1
  }

  // Two-parameter form (zh, en) - generate spans for dynamic switching
  if (arg2 !== null) {
    const zhClass = currentLang === 'zh' ? '' : 'd-none'
    const enClass = currentLang === 'en' ? '' : 'd-none'
    return `<span data-lang="zh" class="${zhClass}">${arg1}</span><span data-lang="en" class="${enClass}">${arg2}</span>`
  }

  // Single parameter fallback
  return arg1
}

// Build complete nav from config
function buildNavFromConfig(config) {
  const brandLabel = getLabel(config.brand)
  const brand = `<a class="navbar-brand" href="${config.brand.href}" target="_self">${brandLabel}</a>`

  const leftItems = config.left.map(item => {
    if (item.items) {
      return buildDropdown(item)
    } else {
      return buildNavItem(item)
    }
  }).join('')

  const rightItems = config.right.map(item => buildNavItem(item)).join('')

  return `
<nav class="navbar fixed-top navbar-expand-lg bg-body-tertiary px-5">
  <div class="container-fluid">
    ${brand}
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarContent">
      <ul class="navbar-nav">${leftItems}</ul>
      <ul class="navbar-nav flex-row flex-wrap ms-md-auto">
        ${rightItems}
        <li class="nav-item d-flex align-items-center">${buildLangSwitch()}</li>
      </ul>
    </div>
  </div>
</nav>`
}

$(()=>{

  // Global Modal shown event - update language for all modals
  document.addEventListener('shown.bs.modal', () => {
    updatePageLang()
  })

  // Render nav and attach events (must be inside jQuery ready to access setContent)
  async function renderNav() {
    const config = await loadNavConfig()
    const navHtml = buildNavFromConfig(config)
    $('#nav').html(navHtml)

    // Attach setContent click handlers
    $('.setContent').on('click', (e) => {
      e.preventDefault()
      setContent(e.target.pathname, true)
    })

    // Attach language dropdown handler
    $(document).on('click', '.lang-option', function(e) {
      e.preventDefault()
      const newLang = $(this).data('lang-code')
      if (newLang && newLang !== currentLang) {
        currentLang = newLang
        localStorage.setItem('lang', currentLang)
        renderNav()
        updatePageLang()
        // Reload current page content to update dynamically generated text (buttons, etc.)
        setContent(location.pathname, false)
      }
    })
  }

  // ============================================
  // localStorage 快取工具函數
  // ============================================
  const CACHE_PREFIX = 'tableCache_'
  const CACHE_VERSION = 'v1'

  function getCacheKey(tableType) {
    return `${CACHE_PREFIX}${tableType}_${CACHE_VERSION}`
  }

  function getCache(tableType) {
    try {
      const key = getCacheKey(tableType)
      const cached = localStorage.getItem(key)
      if (!cached) return null
      const parsed = JSON.parse(cached)
      console.log(`[Cache] 讀取 ${tableType} 快取，${parsed.data?.length || 0} 筆資料`)
      return parsed
    } catch (e) {
      console.error('[Cache] 讀取快取失敗:', e)
      return null
    }
  }

  function setCache(tableType, data, etag = null) {
    try {
      const key = getCacheKey(tableType)
      const cacheData = {
        data: data,
        etag: etag,
        timestamp: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
      console.log(`[Cache] 儲存 ${tableType} 快取，${data?.length || 0} 筆資料`)
    } catch (e) {
      console.error('[Cache] 儲存快取失敗:', e)
      // localStorage 可能已滿，嘗試清除舊快取
      clearOldCaches()
    }
  }

  function clearOldCaches() {
    // 清除所有表格快取
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key)
      }
    }
    console.log('[Cache] 已清除舊快取')
  }

  // 比較資料是否相同（使用 JSON 字串比較）
  function isDataEqual(data1, data2) {
    if (!data1 || !data2) return false
    if (data1.length !== data2.length) return false
    return JSON.stringify(data1) === JSON.stringify(data2)
  }

  // Set marked options
  marked.use()

  //message modal 
  var msgModal = new bootstrap.Modal(document.getElementById('modal'))

  // Initialize navigation from config (async, store promise)
  let navReadyPromise = renderNav()

  function setContent(path, clk=false){
    //clk: by click
    /*
      verify user use what page
      at least length 1: /
    */

    var url='', title='', process=''

    if(path === undefined || path.length < 2 || !path.includes('/')){
      url = 'pages/main.md'
    }
    else{
      url = path.slice(1).replace(/\/$/, '')  // Remove trailing slash
      const normalizedPath = path.replace(/\/$/, '')  // Also normalize path for navbar search

      //find title
      let t = $("#navbarContent a[href='"+normalizedPath+"']")
        if(t.length==0){
          $('#modalFooter').empty()
          //not found = url mismatch
          $('#modalMsg').html('Load page fail.<br>If you think the url is correct, please report in github issues.')
          $('#modalFooter').append('<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="urlError">OK</button>')
          msgModal.show()
          url = 'pages/main.md'
        }
        else{
          title = t.text()+' - '
          process = url

          // 根據檔案類型設定正確的路徑
          let ext = t.data().ext
          if(ext === '.json') {
            // Use new API endpoints instead of JSON files
            if (process === 'streamlist') {
              url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.streamlist
            } else if (process === 'setlist') {
              url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.setlist
            } else {
              url = 'assets/data/' + url + ext
            }
          } else if(ext === '.htm' || ext === '.md') {
            url = 'pages/' + url + ext
          } else {
            url += ext
          }

          //songlist uses API endpoint now
          if(process=='songlist') {
            url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.songlist
          }

          //aliases uses API endpoint
          if(process=='aliases') {
            url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.aliases
          }
        }

      if(clk){
        //by clicking navbar->write to history
        history.pushState({}, '', path)
      }
    }

    // Set page title
    document.title = title + '苺咲べりぃ非公式倉庫'

    // For API endpoints (setlist, streamlist, songlist, aliases), skip $.ajax() and directly call configJsonTable
    // This eliminates duplicate requests (previously $.ajax() + Tabulator's ajaxURL)
    if(process=='setlist' || process=='streamlist' || process=='songlist' || process=='aliases'){
      let c = `
            <button id='reloadBtn' class='btn btn-outline-light' data-disable-on-loading="true">
              <span class="loading-indicator spinner-border spinner-border-sm me-2" style="display: none;"></span>
              ${t('重新載入', 'Reload Data', 'リロード')}
            </button>
            <button id='edit' class='btn btn-outline-light' data-bs-toggle="button">${t('編輯模式', 'Edit Mode', '編集モード')}</button>
            <button id='`+ (process=='streamlist'?'addStreamRow':(process=='aliases'?'addAlias':'addRow')) + `' class='btn btn-outline-light addRow' disabled>${t('新增列', 'Add Row', '行追加')}</button>` +
            (process=='aliases'?`<button id='batchAddAliases' class='btn btn-outline-light addRow' disabled>📦 ${t('批次新增', 'Batch Add', '一括追加')}</button>
            <button id='testAlias' class='btn btn-outline-light'>🧪 ${t('測試別名', 'Test Alias', 'エイリアステスト')}</button>`:'') +
            `<button id='deleteRow' class='btn btn-outline-light'>${t('刪除列', 'Delete Row', '行削除')}</button>
            <button id='dlcsv' class='btn btn-outline-light'>${t('下載 CSV', 'Get CSV', 'CSV取得')}</button>
            <button id='dljson' class='btn btn-outline-light'>${t('下載 JSON', 'Get JSON', 'JSON取得')}</button>`
            + (process=='setlist'?`
            <div class="my-2">
              <button id='addNewSongInSetlist' class='btn btn-success' style="display: none;">
                ➕ ${t('新增初回歌曲', 'Add New Song', '新規楽曲追加')}
              </button>
            </div>`:'') +
            `<div id='setTableMsg' class='p-3'>&emsp;</div>
            <!-- 進階搜尋區塊 -->
            <div id="advancedSearch" class="card bg-dark mb-3 w-100">
              <div class="card-header d-flex justify-content-between align-items-center" style="cursor: pointer;" data-bs-toggle="collapse" data-bs-target="#searchBody">
                <span><i class="bi bi-search me-2"></i>${t('進階搜尋', 'Advanced Search', '詳細検索')}</span>
                <i class="bi bi-chevron-down"></i>
              </div>
              <div id="searchBody" class="collapse">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <span class="me-3">${t('條件邏輯：', 'Logic:', 'ロジック：')}</span>
                    <div class="btn-group" role="group">
                      <input type="radio" class="btn-check" name="searchLogic" id="logicAnd" value="and" checked>
                      <label class="btn btn-outline-primary btn-sm" for="logicAnd">${t('AND (全部符合)', 'AND (Match All)', 'AND (すべて一致)')}</label>
                      <input type="radio" class="btn-check" name="searchLogic" id="logicOr" value="or">
                      <label class="btn btn-outline-primary btn-sm" for="logicOr">${t('OR (任一符合)', 'OR (Match Any)', 'OR (いずれか一致)')}</label>
                    </div>
                  </div>
                  <div id="searchConditions">
                    <!-- 動態新增的搜尋條件 -->
                  </div>
                  <div class="d-flex gap-2 mt-3">
                    <button id="addCondition" class="btn btn-outline-secondary btn-sm">
                      <i class="bi bi-plus-lg me-1"></i>${t('新增條件', 'Add Condition', '条件追加')}
                    </button>
                    <button id="applySearch" class="btn btn-primary btn-sm">
                      <i class="bi bi-search me-1"></i>${t('搜尋', 'Search', '検索')}
                    </button>
                    <button id="clearSearch" class="btn btn-outline-danger btn-sm">
                      <i class="bi bi-x-lg me-1"></i>${t('清除', 'Clear', 'クリア')}
                    </button>
                  </div>
                  <div class="mt-3 small text-muted">
                    <details>
                      <summary style="cursor: pointer;"><i class="bi bi-question-circle me-1"></i>${t('搜尋運算子說明', 'Operator Reference', '演算子の説明')}</summary>
                      <ul class="mt-2 mb-0 ps-3" data-lang="zh">
                        <li><strong>包含</strong>：欄位內含此文字 (例: "HAPPY" 找到 "happy girl")</li>
                        <li><strong>等於</strong>：欄位完全符合此值</li>
                        <li><strong>不包含</strong>：欄位不含此文字</li>
                        <li><strong>Like (%萬用)</strong>：% 代表任意字元 (例: "H%Y" 找到 "HAPPY", "HEY")</li>
                        <li><strong>關鍵字群</strong>：空格分隔，全部必須匹配 (例: "happy train" 找到含兩詞的歌)</li>
                        <li><strong>多值匹配</strong>：逗號分隔，任一匹配即可 (例: "berry,莓" 找到含任一的)</li>
                        <li><strong>正規表達式</strong>：進階模式 (例: "^H.*Y$" 開頭H結尾Y)</li>
                      </ul>
                      <ul class="mt-2 mb-0 ps-3 d-none" data-lang="en">
                        <li><strong>Contains</strong>: Field contains this text (e.g., "HAPPY" finds "happy girl")</li>
                        <li><strong>Equals</strong>: Field exactly matches this value</li>
                        <li><strong>Not Contains</strong>: Field does not contain this text</li>
                        <li><strong>Like (% wildcard)</strong>: % represents any characters (e.g., "H%Y" finds "HAPPY", "HEY")</li>
                        <li><strong>Keywords</strong>: Space-separated, all must match (e.g., "happy train")</li>
                        <li><strong>Multi-value</strong>: Comma-separated, any matches (e.g., "berry,莓")</li>
                        <li><strong>Regex</strong>: Advanced mode (e.g., "^H.*Y$" starts with H, ends with Y)</li>
                      </ul>
                      <ul class="mt-2 mb-0 ps-3 d-none" data-lang="ja">
                        <li><strong>含む</strong>：フィールドにこのテキストを含む (例: "HAPPY" で "happy girl" を検索)</li>
                        <li><strong>等しい</strong>：フィールドが完全に一致する</li>
                        <li><strong>含まない</strong>：フィールドにこのテキストを含まない</li>
                        <li><strong>Like (%ワイルドカード)</strong>：% は任意の文字を表す (例: "H%Y" で "HAPPY", "HEY" を検索)</li>
                        <li><strong>キーワード</strong>：スペース区切り、すべて一致する必要がある (例: "happy train")</li>
                        <li><strong>複数値</strong>：カンマ区切り、いずれかに一致 (例: "berry,莓")</li>
                        <li><strong>正規表現</strong>：上級モード (例: "^H.*Y$" Hで始まりYで終わる)</li>
                      </ul>
                    </details>
                  </div>
                </div>
              </div>
            </div>
            <div id='tb' class='table-dark table-striped table-bordered'>${t('載入中...', 'Loading...', '読み込み中...')}</div>
              `
      $("#content").empty().append(c)
      updatePageLang()  // Update language for dynamically generated content
      configJsonTable(url, process)
    }
    // For other content (markdown, HTML), use $.ajax() to fetch content
    else {
      $.ajax({
        url:url,
        //cache:false
      }).done((d, textStatus, request)=>{
        let ext = url.split('.')  //check .html

        if(ext[1] == 'htm'){
          $("#content").empty().append(d)
          updatePageLang()  // Update language for page content

          // Dynamically load analytics module when analytics.htm is loaded
          // (jQuery doesn't execute <script type="module"> tags in dynamic content)
          if(url.includes('analytics.htm')) {
            import('/assets/js/analytics.js').then(module => {
              module.initAnalytics()
            }).catch(err => {
              console.error('[Analytics] Failed to load module:', err)
            })
          }
        }
        else{
          var c ="<div id='md'>"+marked.parse(d)+"</div>"

          $("#content").empty().append(c)

          //append latest video info / update info
          if(url == 'pages/main.md'){
            getLatest().then(r=>{
              $("#content").append(r)
            })
          }

          //if data is remote, tell the source
          if(url.includes('http')){
            if(url.includes('hackmd.io')) {url=url.replace('/download', '')}
            $("#content").prepend("<div id='source' class='mb-2'>Source: <a href='"+url+"'>"+url+"</a></div>")
          }

          // Only apply setContentMDTable to Markdown tables (not database-driven tables)
          setContentMDTable()
          updatePageLang()  // Update language for markdown content
        }
      }).fail((jqXHR, textStatus)=>{
        $('#modalFooter').empty()
        $('#modalMsg').html('Load page fail：'+ textStatus + '<br>If you think the url is correct, please report in github issues.')
        $('#modalFooter').append('<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="urlError">OK</button>')
        msgModal.show()
      })
    }
  }
  
  function setContentMDTable(){
    let t = [...document.querySelectorAll('table')].forEach(e=>{
      new Tabulator(e, {
        columnDefaults:{
          width:200,
          headerFilter:true,
        },
        height:700,
        persistence:true,
        downloadRowRange:'all',
        selectableRows:true,
        selectableRowsRangeMode:"click",
      })
    })
  }


  // Dynamic field data generation for both array and string fields
  // Supports bilingual fields: pass fieldEn to show as "日文 | 英文" format
  function getDynamicFieldData(table, field, fieldEn) {
    try {
      // Check if data is processed and ready
      if (!window.tableDataLoaded) {
        return [];
      }

      const tableData = table ? table.getData() : (window.jsonTable ? window.jsonTable.getData() : []);
      const uniqueOptions = new Map();  // Use Map to avoid duplicates by Japanese value

      if (tableData.length === 0) {
        return [];
      }

      tableData.forEach(row => {
        const fieldValue = row[field];

        if (Array.isArray(fieldValue)) {
          // Handle array fields (like categories)
          fieldValue.forEach(val => {
            if (val && typeof val === 'string' && val.trim().length > 0) {
              const trimmedVal = val.trim();
              if (!uniqueOptions.has(trimmedVal)) {
                uniqueOptions.set(trimmedVal, {id: trimmedVal, text: trimmedVal});
              }
            }
          });
        } else if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
          // Handle string fields (like songName, artist, note)
          const jaValue = String(fieldValue).trim();

          if (jaValue.length > 0) {
            // If bilingual field is provided, format as "日文 | 英文"
            if (fieldEn) {
              const enValue = row[fieldEn];
              let displayText;

              if (enValue && String(enValue).trim() && String(enValue).trim() !== jaValue) {
                displayText = `${jaValue} | ${String(enValue).trim()}`;
              } else {
                displayText = jaValue;
              }

              // Use Japanese value as key to avoid duplicates
              if (!uniqueOptions.has(jaValue)) {
                uniqueOptions.set(jaValue, {id: jaValue, text: displayText});
              }
            } else {
              // No bilingual support, use simple format
              if (!uniqueOptions.has(jaValue)) {
                uniqueOptions.set(jaValue, {id: jaValue, text: jaValue});
              }
            }
          }
        }
      });

      const result = Array.from(uniqueOptions.values()).sort((a, b) => a.text.localeCompare(b.text));
      return result;
    } catch (error) {
      return [];
    }
  }

  //--- url Error ---
  $('#modalFooter').on('click', '#urlError', ()=>{
    setContent()
    $('#modalFooter').empty()
  })

  //--- Context Menu for streamlist ---
  function showContextMenu(x, y, items) {
    // Remove any existing context menu
    $('.context-menu').remove()

    // Create context menu
    const menu = $('<div class="context-menu"></div>')

    items.forEach(item => {
      if (item.type === 'divider') {
        menu.append('<div class="context-menu-divider"></div>')
      } else {
        const menuItem = $(`<div class="context-menu-item">${item.label}</div>`)
        menuItem.on('click', () => {
          item.action()
          menu.remove()
        })
        menu.append(menuItem)
      }
    })

    // Position and show menu
    menu.css({ left: x + 'px', top: y + 'px' })
    $('body').append(menu)

    // Close menu on outside click
    $(document).one('click', () => menu.remove())

    // Prevent menu from being immediately closed by the same click
    setTimeout(() => {
      $(document).on('click.contextmenu', () => {
        menu.remove()
        $(document).off('click.contextmenu')
      })
    }, 10)
  }

  // Batch Editor variables
  let batchTable = null
  let batchStreamData = null
  const batchEditModal = new bootstrap.Modal(document.getElementById('modalBatchEdit'))

  // Batch editor Song Select2 - stores songID, displays "songName - artist"
  const batchSongSelect2Editor = function(cell, onRendered, success, cancel){
    const editor = document.createElement("select")
    let hasSucceeded = false

    onRendered(async function(){
      let op = $(editor)

      try {
        // Fetch songlist data from API
        const songlist = await apiRequest('GET', API_CONFIG.ENDPOINTS.songlist)

        // Format: {id: songID, text: "songName - artist"}
        const dataOptions = songlist.map(s => ({
          id: s.songID,
          text: `${s.songName} - ${s.artist}`,
          songName: s.songName,
          artist: s.artist,
          songNameEn: s.songNameEn,
          artistEn: s.artistEn
        })).sort((a, b) => a.text.localeCompare(b.text))

        op.select2({
          data: dataOptions,
          width: '100%',
          dropdownAutoWidth: true,
          placeholder: t('選擇歌曲...', 'Select song...', '曲を選択...'),
          allowClear: true,
          multiple: false,
          dropdownParent: $('#modalBatchEdit')
        })

        // Set current value (songID)
        const val = cell.getValue()
        if (val) {
          op.val(val).trigger('change.select2')
        }

        op.on('select2:select select2:clear', function(e){
          if (hasSucceeded) return

          const selectedId = op.val()
          const selectedData = op.select2('data')[0]

          // Update row data with songID and display info
          const row = cell.getRow()
          const rowData = row.getData()
          rowData.songID = selectedId || null
          if (selectedData && selectedData.songName) {
            rowData.songDisplay = selectedData.text
            rowData.songName = selectedData.songName
            rowData.artist = selectedData.artist
            rowData.songNameEn = selectedData.songNameEn
            rowData.artistEn = selectedData.artistEn
          } else {
            rowData.songDisplay = ''
            rowData.songName = ''
            rowData.artist = ''
            rowData.songNameEn = ''
            rowData.artistEn = ''
          }

          // Update the row to trigger formatter refresh
          row.update(rowData)

          hasSucceeded = true
          success(selectedId)
        })

        op.on('select2:close', function(){
          if (hasSucceeded) return

          // Get current value on close
          const selectedId = op.val()
          const selectedData = op.select2('data')[0]

          // Update display info even on close
          const row = cell.getRow()
          const rowData = row.getData()
          rowData.songID = selectedId || null
          if (selectedData && selectedData.songName) {
            rowData.songDisplay = selectedData.text
            rowData.songName = selectedData.songName
            rowData.artist = selectedData.artist
          } else {
            rowData.songDisplay = ''
            rowData.songName = ''
            rowData.artist = ''
          }

          // Update the row to trigger formatter refresh
          row.update(rowData)

          hasSucceeded = true
          success(selectedId)
        })

      } catch (error) {
        console.error('Failed to load select2 data:', error)
        if (!hasSucceeded) {
          hasSucceeded = true
          success(cell.getValue())
        }
      }
    })

    return editor
  }

  // Select2 editor for setlist table song selection
  const setlistSongSelect2Editor = function(cell, onRendered, success, cancel) {
    const editor = document.createElement("select")
    let hasSucceeded = false

    onRendered(async function() {
      const $editor = $(editor)

      try {
        // Fetch songlist data from API
        console.log('[setlistSongSelect2Editor] Fetching songlist from API...')
        const songlist = await apiRequest('GET', API_CONFIG.ENDPOINTS.songlist)
        console.log(`[setlistSongSelect2Editor] Loaded ${songlist.length} songs`)

        // Format: {id: songID, text: "songName - artist", with bilingual data}
        const dataOptions = songlist.map(s => ({
          id: s.songID,
          text: `${s.songName} - ${s.artist}`,  // 選中後顯示的格式
          songName: s.songName,
          songNameEn: s.songNameEn,
          artist: s.artist,
          artistEn: s.artistEn
        })).sort((a, b) => a.text.localeCompare(b.text))

        // Initialize Select2
        $editor.select2({
          data: dataOptions,
          width: '100%',
          dropdownAutoWidth: true,
          placeholder: t('選擇歌曲...', 'Select song...', '曲を選択...'),
          allowClear: true,
          tags: false,  // 明確禁止自由輸入
          dropdownParent: $('body')  // Avoid z-index issues
          // 使用預設的 Select2 顯示格式：「歌名 - 歌手」單行格式
        })

        // Set current value from songID
        const currentSongID = cell.getRow().getData().songID
        if (currentSongID) {
          console.log(`[setlistSongSelect2Editor] Setting current value: ${currentSongID}`)
          $editor.val(currentSongID).trigger('change.select2')
        }

        // Handle selection change
        $editor.on('select2:select select2:clear', async function(e) {
          if (hasSucceeded) return

          const selectedId = $editor.val()
          const selectedData = $editor.select2('data')[0]

          console.log('[setlistSongSelect2Editor] Selection changed:', {
            songID: selectedId,
            songName: selectedData?.songName,
            artist: selectedData?.artist
          })

          // Update row data
          const row = cell.getRow()
          const rowData = row.getData()

          // Update local data
          if (selectedData && selectedData.songName) {
            row.update({
              songID: selectedId,
              songName: selectedData.songName,
              artist: selectedData.artist,
              songNameEn: selectedData.songNameEn,
              artistEn: selectedData.artistEn
            })
          } else {
            row.update({
              songID: null,
              songName: '',
              artist: '',
              songNameEn: '',
              artistEn: ''
            })
          }

          // Sync to API immediately
          try {
            const endpoint = API_CONFIG.ENDPOINTS.setlist
            const id = `${rowData.streamID}/${rowData.trackNo}`
            const updateData = { songID: selectedId || null }

            console.log(`[setlistSongSelect2Editor] Syncing to API: PUT ${endpoint}/${id}`, updateData)
            await apiRequest('PUT', `${endpoint}/${id}`, updateData)

            // Show success indicator
            cell.getElement().style.backgroundColor = '#d4edda'
            setTimeout(() => {
              cell.getElement().style.backgroundColor = ''
            }, 1000)

            console.log(`[setlistSongSelect2Editor] ✅ Song updated successfully`)
          } catch (error) {
            console.error('[setlistSongSelect2Editor] ❌ Error syncing to API:', error)
            alert(`儲存失敗 / Save failed：${error.message}`)
            // Revert on error
            cancel()
            return
          }

          hasSucceeded = true
          success(selectedData ? selectedData.songName : '')  // Return songName for the cell value
        })

        // Handle close without selection
        $editor.on('select2:close', function() {
          if (!hasSucceeded) {
            console.log('[setlistSongSelect2Editor] Closed without selection, canceling')
            cancel()
          }
        })

        // Auto-open dropdown after initialization
        console.log('[setlistSongSelect2Editor] Opening dropdown...')
        setTimeout(() => $editor.select2('open'), 50)

      } catch (error) {
        console.error('[setlistSongSelect2Editor] ❌ Failed to initialize:', error)
        alert('載入歌曲清單失敗 / Failed to load songlist：' + error.message)
        if (!hasSucceeded) {
          hasSucceeded = true
          cancel()
        }
      }
    })

    return editor
  }

  // Custom formatter to display "songName - artist" even though cell stores songID
  const songDisplayFormatter = function(cell) {
    const rowData = cell.getRow().getData()
    return rowData.songDisplay || ''
  }

  async function openBatchEditor(streamData) {
    console.log('Opening batch editor for:', streamData)
    batchStreamData = streamData

    // Set stream info
    $('#batchStreamID').text(streamData.streamID)
    $('#batchStreamTitle').text(streamData.title)

    // Clear previous table
    if (batchTable) {
      batchTable.destroy()
      batchTable = null
    }
    $('#batchTableContainer').empty()

    // Check if existing setlist data exists for this stream
    // Use API filter parameter for better performance (instead of fetching all and filtering locally)
    try {
      const existingEntries = await apiRequest('GET', `${API_CONFIG.ENDPOINTS.setlist}?streamID=${streamData.streamID}`)
      // Data is already sorted by API (segmentNo, trackNo), no need to sort again

      if (existingEntries.length > 0) {
        // Found existing data - auto-populate
        const firstEntry = existingEntries[0]
        const lastEntry = existingEntries[existingEntries.length - 1]

        $('#batchStartTrack').val(firstEntry.trackNo)
        $('#batchTotalSongs').val(existingEntries.length)
        $('#batchSegment').val(firstEntry.segmentNo || 1)

        // Show status message
        $('#batchLoadStatus').html(`
          ✅ ${t({ zh: `已載入現有歌單資料（${existingEntries.length} 首）`, en: `Loaded existing setlist (${existingEntries.length} songs)` })}<br>
          <small>${t({ zh: '可直接編輯或點擊「產生表格」重新建立', en: 'Edit directly or click "Generate Table" to recreate' })}</small>
        `).removeClass('alert-warning').addClass('alert-success').show()

        // Auto-generate table with existing data (no setTimeout needed)
        loadExistingSetlist(existingEntries)

        console.log(`Loaded ${existingEntries.length} existing setlist entries`)
      } else {
        // No existing data - use defaults
        $('#batchStartTrack').val(1)
        $('#batchTotalSongs').val(20)
        $('#batchSegment').val(1)

        // Show status message
        $('#batchLoadStatus').html(`
          📋 ${t({ zh: '此直播尚無歌單資料', en: 'No setlist data for this stream' })}<br>
          <small>${t({ zh: '請設定參數後點擊「產生表格」開始建立', en: 'Set parameters and click "Generate Table" to start' })}</small>
        `).removeClass('alert-success').addClass('alert-warning').show()
      }
    } catch (error) {
      console.error('Failed to load existing setlist:', error)
      // Use defaults on error
      $('#batchStartTrack').val(1)
      $('#batchTotalSongs').val(20)
      $('#batchSegment').val(1)
    }

    batchEditModal.show()
  }

  function loadExistingSetlist(entries) {
    // Get songlist for mapping
    apiRequest('GET', API_CONFIG.ENDPOINTS.songlist).then(songlist => {
      // Build songID -> song Map for O(1) lookup (instead of O(n) find)
      const songMap = new Map(songlist.map(s => [s.songID, s]))

      // Map entries to table rows
      const rows = entries.map(entry => {
        const song = songMap.get(entry.songID)
        return {
          trackNo: entry.trackNo,
          songID: entry.songID,
          songDisplay: song ? `${song.songName} - ${song.artist}` : '',
          songName: song ? song.songName : '',
          artist: song ? song.artist : '',
          note: entry.note || ''
        }
      })

      // Destroy previous table if exists
      if (batchTable) {
        batchTable.destroy()
      }

      // Create table with existing data
      batchTable = new Tabulator("#batchTableContainer", {
        data: rows,
        layout: "fitColumns",
        movableRows: true,
        columns: [
          {title: "Track", field: "trackNo", width: 80, editor: false},
          {
            title: "Song (歌名 - 歌手)",
            field: "songID",
            editor: batchSongSelect2Editor,
            formatter: songDisplayFormatter,
            headerSort: false,
            widthGrow: 3
          },
          {
            title: "Note",
            field: "note",
            editor: "input",
            headerSort: false,
            widthGrow: 2
          }
        ]
      })

      // Update track numbers on row move
      batchTable.on("rowMoved", recalculateTrackNumbers)

      // Update track numbers when start track changes (remove old handler first)
      $('#batchStartTrack').off('change').on('change', function() {
        if (batchTable) {
          recalculateTrackNumbers()
        }
      })
    }).catch(error => {
      console.error('Failed to load songlist for existing setlist:', error)
      alert('載入歌單資料失敗，請點擊「產生表格」重新建立')
    })
  }

  // Quick Add variables
  let quickStreamData = null
  let quickCurrentTrack = null
  let quickAddModal = new bootstrap.Modal(document.getElementById('modalQuickAdd'))
  let quickSongSelect2 = null

  async function openQuickAdd(streamData) {
    console.log('Opening quick add for:', streamData)
    quickStreamData = streamData

    // === 1. 立即開啟 Modal（不等待） ===
    quickAddModal.show()

    // === 2. 顯示載入遮罩（鎖定 Modal） ===
    $('#quickAddLoadingOverlay').show()

    // Set stream info
    $('#quickStreamID').text(streamData.streamID)
    $('#quickStreamTitle').text(streamData.title)

    // Reset form
    $('#quickStartTrack').val('')
    $('#quickSegment').val(1)
    $('#quickNote').val('')
    $('#quickAddedList').html(`<small class="text-muted">${t('尚未新增任何歌曲', 'No songs added yet', 'まだ楽曲が追加されていません')}</small>`)

    // 清空並隱藏錯誤訊息
    $('#quickAddErrorMsg').html('')
    $('#quickAddError').hide()

    // Reset state
    quickCurrentTrack = null
    $('#quickAddFormSection').hide()
    $('#quickStartSection').show()

    // Destroy existing Select2 if present
    if ($('#quickSongSelect').hasClass('select2-hidden-accessible')) {
      $('#quickSongSelect').select2('destroy')
    }
    $('#quickSongSelect').empty().html(`<option value="">${t('搜尋歌曲...', 'Search song...', '曲を検索...')}</option>`)

    // === 3. Try to auto-detect next track ===
    try {
      const existingEntries = await apiRequest('GET', `${API_CONFIG.ENDPOINTS.setlist}?streamID=${streamData.streamID}`)

      if (existingEntries.length > 0) {
        const maxTrack = Math.max(...existingEntries.map(e => e.trackNo))
        const firstSegment = existingEntries[0].segmentNo || 1
        $('#quickStartTrack').val(maxTrack + 1)
        $('#quickSegment').val(firstSegment)
        console.log(`Auto-detected next track: ${maxTrack + 1}`)
      } else {
        console.log('No existing setlist found, user will fill Track manually')
      }

      // === 4a. 成功：移除遮罩，解鎖 Modal ===
      $('#quickAddLoadingOverlay').hide()
      setTimeout(() => $('#quickStartTrack').focus(), 100)

    } catch (error) {
      console.error('Failed to auto-detect track:', error)

      // === 4b. 失敗：移除遮罩 → 關閉 Modal → 顯示錯誤 ===
      $('#quickAddLoadingOverlay').hide()
      quickAddModal.hide()
      showConnectionError(error.message || String(error))
    }
  }

  // Helper function to show connection error alert
  function showConnectionError(errorDetails) {
    let message = `請檢查 Hyperdrive 服務是否啟動（<code>${API_CONFIG.BASE_URL}</code>），或稍後再試。`

    if (errorDetails.includes('timeout')) {
      message = `連線逾時。請檢查網路連線或 Hyperdrive 服務狀態（<code>${API_CONFIG.BASE_URL}</code>）。`
    } else if (errorDetails.includes('NetworkError') || errorDetails.includes('Failed to fetch')) {
      message = `無法連線至伺服器（<code>${API_CONFIG.BASE_URL}</code>）。請確認 Hyperdrive 服務正在運行。`
    }

    $('#connectionErrorMessage').html(message)

    const alertElement = $('#connectionErrorAlert')
    alertElement.removeClass('fade').addClass('show').slideDown(300)

    // 不自動關閉，需要使用者手動點擊 X 按鈕關閉
  }

//--- json table ---
  //use a global variable to easy access the table and colDef
  var jsonTable, colDef

  //column definition (as functions to support dynamic language switching)
  function getSetlistColDef() {
    return [
    {title:"streamID", field:"streamID", visible: false, download:true},
    {title:t('本地時間', 'local time', '現地時間')+`(${dayjs().format('Z')})`, field:"time", mutator: (cell) => dayjs(cell).format('YYYY/MM/DD HH:mm'), accessor: (value) => {
      const date = dayjs(value);
      return date.isValid() ? date.toISOString() : value;
    }, width:'150', formatter:dateWithYTLink},
    {title:t('段落', 'Seg', 'セグ'), field:"segmentNo", sorter:'number', width:60},
    {title:t('曲序', 'Track', 'トラック'), field:"trackNo", sorter:'number', width:80},
    {
      title:t('曲名', 'Song', '曲名'),
      field:"songName",
      editor: setlistSongSelect2Editor,
      editable: false,
      width: 300,
      topCalc:'count',
      topCalcFormatter:(c=>t('小計：', 'subtotal: ', '小計：')+c.getValue()),
      headerFilter: select2,
      headerFilterParams: {
        field: "songName",
        fieldEn: "songNameEn"
      },
      headerFilterFunc: function(headerValue, rowValue, rowData) {
        // Fuzzy search: match if headerValue is contained in Japanese or English name
        if (!headerValue) return true;
        const searchTerm = headerValue.toLowerCase();
        const jaMatch = rowData.songName?.toLowerCase().includes(searchTerm) || false;
        const enMatch = rowData.songNameEn?.toLowerCase().includes(searchTerm) || false;
        return jaMatch || enMatch;
      },
      headerSort:false,
      formatter: function(cell) {
        const row = cell.getRow().getData();
        const ja = row.songName || '';
        const en = row.songNameEn || '';
        return `<div style="line-height: 1.5;"><div style="font-weight: 500;">${ja}</div>${en ? `<div style="font-size: 0.85em; color: #999; margin-top: 2px;">${en}</div>` : ''}</div>`;
      }
    },
    {
      title:t('歌手', 'Artist', 'アーティスト'),
      field:"artist",
      width: 250,
      headerFilter: select2,
      headerFilterParams: {
        field: "artist",
        fieldEn: "artistEn"
      },
      headerFilterFunc: function(headerValue, rowValue, rowData) {
        // Fuzzy search: match if headerValue is contained in Japanese or English artist name
        if (!headerValue) return true;
        const searchTerm = headerValue.toLowerCase();
        const jaMatch = rowData.artist?.toLowerCase().includes(searchTerm) || false;
        const enMatch = rowData.artistEn?.toLowerCase().includes(searchTerm) || false;
        return jaMatch || enMatch;
      },
      headerSort:false,
      formatter: function(cell) {
        const row = cell.getRow().getData();
        const ja = row.artist || '';
        const en = row.artistEn || '';
        return `<div style="line-height: 1.5;"><div>${ja}</div>${en ? `<div style="font-size: 0.85em; color: #999; margin-top: 2px;">${en}</div>` : ''}</div>`;
      }
    },
    {
      title:t('備註', 'Note', 'メモ'),
      field:"note",
      headerFilter:select2,
      headerFilterParams:{field:"note"},
      headerFilterFunc: function(headerValue, rowValue, rowData) {
        // Fuzzy search: match if headerValue is contained in note
        if (!headerValue) return true;
        const searchTerm = headerValue.toLowerCase();
        return rowData.note?.toLowerCase().includes(searchTerm) || false;
      },
      headerSort:false
    },
    {title:"YTLink", field:"YTLink", visible: false, download:true},
    {title:"songID", field:"songID", visible: false, download:true},  // Hidden field for database ID
    {title:"songNameEn", field:"songNameEn", visible: false, download:true},  // Hidden field for English name
    {title:"artistEn", field:"artistEn", visible: false, download:true}  // Hidden field for English artist
  ]}

  function getStreamlistColDef() {
    return [
    {title:t('縮圖', 'thumbnail', 'サムネイル'), formatter:imageLink, headerFilter:false},
    {title:"streamID", field:"streamID", visible: false, download:true},
    {
      title:t('標題', 'title', 'タイトル'),
      field:"title",
      width:300,
      topCalc:'count',
      topCalcFormatter:(c=>t('小計：', 'subtotal: ', '小計：')+c.getValue()),
      formatter:multiLineLinkFormat,
      headerFilter:"input",
      headerFilterPlaceholder:t('搜尋標題或影片 ID', 'Search title or video ID', 'タイトルまたは動画IDで検索'),
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // No filter applied
        if (!headerValue) return true;

        const searchTerm = headerValue.toLowerCase();

        // Search in title
        const titleMatch = rowValue?.toLowerCase().includes(searchTerm) || false;

        // Search in streamID
        const idMatch = rowData.streamID?.toLowerCase().includes(searchTerm) || false;

        // Return true if either matches
        return titleMatch || idMatch;
      }
    },
    {title:t('本地時間', 'local time', '現地時間')+`(${dayjs().format('Z')})`, field:"time", mutator: (cell) => dayjs(cell).format('YYYY/MM/DD HH:mm'), accessor: (value) => {
      const date = dayjs(value);
      return date.isValid() ? date.toISOString() : value;
    }},
    {title:t('分類', 'categories', 'カテゴリ'), field:"categories",
      headerFilter:select2,
      headerFilterParams:{field:'categories', multiple: false},
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // No filter applied (single select returns string or empty)
        if (!headerValue || headerValue === '') return true;

        // Ensure rowValue is an array
        if (!Array.isArray(rowValue)) return false;

        // Check if selected filter value matches any category in the row
        return rowValue.some(rowCat =>
          rowCat.toLowerCase().includes(headerValue.toLowerCase())
        );
      },
      headerSort:false,
      editor:select2,
      editorParams:{field:'categories', multiple: true, tags: true},
      formatter:(cell=>{
        const categories = cell.getValue();
        if (!Array.isArray(categories)) return '';

        // Display categories with line breaks for better readability
        return categories.map(cat => cat).join('<br>');
      })
    },
    {title:t('備註', 'note', 'メモ'), field:"note"},
  ]}

  // Tabulator 自動完成設定常數
  const AUTOCOMPLETE_PARAMS = {
    valuesLookup: "active",
    autocomplete: true
  }

  // Aliases column definition
  function getAliasesColDef() {
    return [
    {title:"aliasID", field:"aliasID", visible: false, download:true},
    {
      title:t('類型', 'Type', 'タイプ'),
      field:"aliasType",
      width:120,
      editor:"list",
      editorParams:{
        values:["artist", "title"]
      },
      headerFilter:"list",
      headerFilterParams:{
        values:["artist", "title"],
        clearable:true
      }
    },
    {
      title:t('標準名稱', 'Canonical Name', '標準名'),
      field:"canonicalName",
      width:250,
      editor:"input",
      headerFilter:"input",
      headerFilterPlaceholder:t('搜尋標準名稱', 'Search canonical name', '標準名を検索')
    },
    {
      title:t('別名', 'Alias Value', 'エイリアス'),
      field:"aliasValue",
      width:250,
      editor:"input",
      headerFilter:"input",
      headerFilterPlaceholder:t('搜尋別名', 'Search alias', 'エイリアスを検索')
    },
    {
      title:t('備註', 'Note', 'メモ'),
      field:"note",
      editor:"input",
      headerFilter:"input"
    },
    {
      title:t('建立時間', 'Created At', '作成日時'),
      field:"createdAt",
      visible: false,
      download: true
    },
    {
      title:t('更新時間', 'Updated At', '更新日時'),
      field:"updatedAt",
      visible: false,
      download: true
    }
  ]}

  // Bilingual version (Japanese + English in one view)
  function getSonglistColDef() {
    return [
    {title:"songID", field:"songID", visible: false, download:true},
    {
      title:t('曲名', 'Song Name', '曲名'),
      field:"songName",
      width:300,
      topCalc:'count',
      topCalcFormatter:(c=>t('小計：', 'subtotal: ', '小計：')+c.getValue()),
      headerFilter:"input",
      headerFilterPlaceholder:t('搜尋日文或英文歌名', 'Search song name (JA/EN)', '曲名を検索（日/英）'),
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        if (!headerValue) return true;
        const searchTerm = headerValue.toLowerCase();
        const jaMatch = rowData.songName?.toLowerCase().includes(searchTerm) || false;
        const enMatch = rowData.songNameEn?.toLowerCase().includes(searchTerm) || false;
        return jaMatch || enMatch;
      },
      formatter: function(cell) {
        const row = cell.getRow().getData();
        const ja = row.songName || '';
        const en = row.songNameEn || '';
        return `<div style="line-height: 1.5;"><div style="font-weight: 500;">${ja}</div>${en ? `<div style="font-size: 0.85em; color: #999; margin-top: 2px;">${en}</div>` : ''}</div>`;
      }
    },
    {
      title:t('歌手', 'Artist', 'アーティスト'),
      field:"artist",
      width:250,
      headerFilter:"input",
      headerFilterPlaceholder:t('搜尋日文或英文歌手', 'Search artist (JA/EN)', 'アーティストを検索（日/英）'),
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        if (!headerValue) return true;
        const searchTerm = headerValue.toLowerCase();
        const jaMatch = rowData.artist?.toLowerCase().includes(searchTerm) || false;
        const enMatch = rowData.artistEn?.toLowerCase().includes(searchTerm) || false;
        return jaMatch || enMatch;
      },
      formatter: function(cell) {
        const row = cell.getRow().getData();
        const ja = row.artist || '';
        const en = row.artistEn || '';
        return `<div style="line-height: 1.5;"><div>${ja}</div>${en ? `<div style="font-size: 0.85em; color: #999; margin-top: 2px;">${en}</div>` : ''}</div>`;
      }
    },
    {title:t('曲風', 'Genre', 'ジャンル'), field:"genre", headerFilter:"input"},
    {title:t('連動作品', 'Tie-up', 'タイアップ'), field:"tieup", headerFilter:"input"},
    {title:t('備註', 'Note', 'メモ'), field:"songNote", headerFilter:"input"},
  ]}

  // Initialize content after all colDef functions are defined
  // (Must be after column definition functions to ensure getSetlistColDef, getStreamlistColDef, getSonglistColDef are available)
  //if direct url - wait for nav to be ready
  navReadyPromise.then(() => setContent(location.pathname))

  // Handle hash navigation after content is loaded
  if (location.hash) {
    // Wait for content to load before processing hash
    setTimeout(() => {
      // Trigger any hash-specific handling for the loaded page
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }, 200)
  }

  //column definition function
  function multiLineLinkFormat(cell){
    cell.getElement().style.whiteSpace ='pre-line'  //set multi line
    const data = cell.getData()
    const id = data.id || data.streamID  // Support both old and new field names
    return "<a href='https://www.youtube.com/watch?v=" + id + "'>"+ cell.getValue() +"</a>"
  }

  function imageLink(cell){
    const data = cell.getData()
    const id = data.id || data.streamID  // Support both old and new field names
    return `<img src='https://i.ytimg.com/vi/${id}/hqdefault.jpg' width="160" height="120">`
  }

  function canEdit(){
    return $('#edit').hasClass('active')
  }

  function dateWithYTLink(cell){
    let d = cell.getData()
    const dateValue = d.date || d.time  // Support both old and new field names
    return `<a href="https://www.youtube.com/watch?v=${d.streamID}">${dayjs(dateValue).format('YYYY/MM/DD')}</a>`
  }


  // Initialize Artist Select2 for songlist modal
  function initializeArtistSelect() {

    $('#artistName').select2({
      allowClear: true,
      tags: true,
      placeholder: t('選擇或輸入歌手名稱...', 'Select or type artist name...', 'アーティスト名を選択または入力...'),
      width: '100%',
      minimumInputLength: 0, // Show all results immediately
      dropdownParent: $('#modalAddSong'), // Fix positioning in modal
      ajax: {
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.songlistArtists}`,
        dataType: 'json',
        delay: 250,
        data: function(params) {
          return {
            q: params.term || '', // search term (empty for initial load)
            page: params.page || 1
          }
        },
        processResults: function(data, params) {
          // Transform API response to Select2 format
          const results = (data.data || data || []).map(item => ({
            id: item.artist,
            text: item.artist,
            artistEn: item.artistEn || ''
          }))

          // If search term exists but not in results, add it as a new option
          params.page = params.page || 1
          const term = params.term?.trim()
          if (term && !results.find(r => r.text.toLowerCase() === term.toLowerCase())) {
            results.unshift({
              id: term,
              text: term,
              newTag: true
            })
          }

          return {
            results: results,
            pagination: {
              more: false // No pagination needed for artists
            }
          }
        },
        cache: true
      },
      createTag: function(params) {
        const term = params.term?.trim()
        if (!term) return null

        return {
          id: term,
          text: term,
          newTag: true
        }
      }
    })


    // Add event handlers (remove old handlers first to prevent duplicates)
    $('#artistName').off('select2:select').on('select2:select', function(e) {
      const selectedData = e.params.data
      console.log('Artist selected:', selectedData)  // Debug log

      if (!selectedData.newTag && selectedData.artistEn) {
        // Existing artist with English name, auto-fill but keep editable
        $('#artistNameEn').val(selectedData.artistEn)
        console.log('ArtistEn auto-filled:', selectedData.artistEn)  // Debug log
      } else {
        console.log('ArtistEn not available - newTag:', selectedData.newTag, 'artistEn:', selectedData.artistEn)  // Debug log
      }
      // For new artists or artists without English names, do nothing, let user fill manually
    })

    $('#artistName').off('select2:clear').on('select2:clear', function() {
      // When cleared, also clear artistEN field for consistency
      $('#artistNameEn').val('')
    })
  }

  // Update all headerFilter options based on currently filtered data (cascade effect)
  function updateAllHeaderFilterOptions(table, triggerField, triggerValue) {
    // Get currently filtered data (what user sees after all filters applied)
    const filteredData = table.getData("active")

    // Find all headerFilter select2 elements for this table
    const headerFilters = $('select[data-header-filter="true"]').filter(function() {
      return $(this).data('tabulatorTable') === table
    })

    headerFilters.each(function() {
      const $select = $(this)
      const field = $select.attr('data-field')

      // For trigger field, use passed value; for others, read from DOM
      let currentValue
      if (field === triggerField) {
        currentValue = triggerValue  // Use the value just set by user
      } else {
        currentValue = $select.val()  // Read current value from DOM
      }

      // Extract unique values from filtered data for this field
      const uniqueValues = new Set()
      filteredData.forEach(row => {
        const value = row[field]
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            // For array fields (like categories), add each item
            value.forEach(v => uniqueValues.add(v))
          } else {
            uniqueValues.add(value)
          }
        }

        // Also check English field if it exists (e.g., songNameEn, artistEn)
        const enField = field + 'En'
        if (row[enField] && row[enField] !== '') {
          uniqueValues.add(row[enField])
        }
      })

      // Convert to sorted array
      const newValues = Array.from(uniqueValues).sort()

      // Get current options to compare
      const currentOptions = []
      $select.find('option').each(function() {
        const val = $(this).val()
        if (val) {  // Skip empty placeholder option
          currentOptions.push(val)
        }
      })

      // Check if options need updating
      const optionsChanged =
        newValues.length !== currentOptions.length ||
        !newValues.every((val, idx) => val === currentOptions[idx])

      if (optionsChanged) {
        // Store whether this is multiple select
        const isMultiple = $select.attr('multiple') === 'multiple'

        // Clear all options
        $select.find('option').remove()

        // For single-select, add empty placeholder option first (required for allowClear)
        if (!isMultiple) {
          $select.append('<option></option>')
        }

        // Add new options (none selected by default)
        newValues.forEach(val => {
          const option = new Option(val, val, false, false)
          $select.append(option)
        })

        // Value restoration logic
        if (field === triggerField) {
          // For trigger field: restore the value user just selected
          if (currentValue !== null && currentValue !== '' &&
              (!Array.isArray(currentValue) || currentValue.length > 0)) {
            if (isMultiple && Array.isArray(currentValue)) {
              const validValues = currentValue.filter(v => newValues.includes(v))
              $select.val(validValues.length > 0 ? validValues : null)
            } else if (!isMultiple) {
              // For single-select, check if value exists in options
              if (newValues.includes(currentValue)) {
                $select.val(currentValue)
              } else {
                // Value doesn't exist in filtered data (user entered a tag)
                // Add it as an option so allowClear can work
                const tagOption = new Option(currentValue, currentValue, true, true)
                $select.append(tagOption)
              }
            }
          } else {
            // User cleared this field, keep it cleared
            $select.val(null)
          }
        } else {
          // For other fields: do NOT auto-select, keep empty
          // Only restore if user had manually selected a value before
          if (currentValue !== null && currentValue !== '' &&
              (!Array.isArray(currentValue) || currentValue.length > 0)) {
            if (isMultiple && Array.isArray(currentValue)) {
              const validValues = currentValue.filter(v => newValues.includes(v))
              $select.val(validValues.length > 0 ? validValues : null)
            } else if (!isMultiple) {
              // For single-select, check if value exists
              if (newValues.includes(currentValue)) {
                $select.val(currentValue)
              } else if (currentValue) {
                // Value doesn't exist (could be a tag from before filtering)
                // Add it back as an option so user can clear it
                const tagOption = new Option(currentValue, currentValue, true, true)
                $select.append(tagOption)
              }
            }
          } else {
            // No previous value, keep empty
            $select.val(null)
          }
        }

        // Trigger select2 to update its display (but not change event)
        $select.trigger('change.select2')
      }
    })
  }

  function select2 (cell, onRendered, success, cancel, editorParams){
    //use select2 replace header filter
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass thesuccessfully updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell
    //editorParams - params object passed into the editorParams column definition property

    // console.log('select2 function called for field:', editorParams.field, 'tableDataLoaded:', window.tableDataLoaded);

    // Create select element for better select2 compatibility
    var editor = document.createElement("select")
    if (editorParams.multiple) {
      editor.setAttribute("multiple", "multiple")
    }

    let f = editorParams.field
    let fEn = editorParams.fieldEn  // Optional English field for bilingual support

    onRendered(function(){
      // console.log('select2 onRendered called for field:', f, 'tableDataLoaded:', window.tableDataLoaded);
      let op = $(editor)
      let hasSucceeded = false  // Guard flag to prevent multiple success() calls

      // Destroy existing select2 instance if present (prevents conflicts when setColumns rebuilds headers)
      if (op.hasClass('select2-hidden-accessible')) {
        op.select2('destroy')
      }

      // Get data dynamically from table for all fields
      // If fieldEn is provided, getDynamicFieldData will include both JA and EN values
      var d = getDynamicFieldData(cell.getTable(), f, fEn)

      // Safely get cell element and determine if this is a header filter or cell editor
      const cellElement = cell.getElement()
      const isHeaderFilter = cellElement && $(cellElement).closest('.tabulator-header').length > 0

      // Determine dropdown parent - use body for header filters to avoid z-index issues
      let dropdownParent = $('body')
      if (!isHeaderFilter && cellElement) {
        const tableContainer = $(cellElement).closest('.tabulator')
        if (tableContainer.length > 0) {
          dropdownParent = tableContainer
        }
      }

      // Read multiple configuration from editorParams
      const isMultiple = editorParams.multiple === true
      const fieldPlaceholder = isMultiple ? 'Select...' : 'Select one...'

      // Add data attributes for headerFilter cascade support
      if (isHeaderFilter) {
        op.attr('data-header-filter', 'true')
        op.attr('data-field', f)
        // Store table reference for later access
        op.data('tabulatorTable', cell.getTable())
      }

      // For single-select mode, add an empty placeholder option to ensure allowClear works
      if (!isMultiple) {
        op.append('<option></option>')
      }

      op.select2({
            data: d,
            width: isHeaderFilter ? '100%' : '100%',  // Full width for both header and cell
            allowClear: true,
            placeholder: fieldPlaceholder,  // Dynamic placeholder
            tags: editorParams.tags !== false,  // Allow tags by default, can be disabled
            multiple: isMultiple,  // Dynamic single/multiple selection
            dropdownParent: dropdownParent
      })

      // Set initial value
      let v = cell.getValue()
      if (isMultiple) {
        // Multiple mode: ensure array format
        if (v === null || v === undefined) {
          v = []
        }
        // If value is string, convert to array
        if (typeof v === 'string' && v) {
          v = [v]
        }
        // Ensure it's an array
        if (!Array.isArray(v)) {
          v = []
        }
      } else {
        // Single mode: keep as string or empty string
        if (v === null || v === undefined) {
          v = ''
        }
        // If value is array, take first element
        if (Array.isArray(v)) {
          v = v[0] || ''
        }
      }

      // Set the value
      op.val(v).trigger('change.select2')

      // Simple change event handler (Select2 4.1.0-rc.0 has native IME support)
      op.on('change', function (e) {
        let val = $(this).val()

        // Handle value format based on multiple mode
        if (isMultiple) {
          // Multiple mode: ensure array format
          val = Array.isArray(val) ? val : (val ? [val] : [])
        } else {
          // Single mode: return string (or first element if array)
          val = Array.isArray(val) ? (val[0] || '') : (val || '')
        }

        success(val)

        // For headerFilter, manually trigger Tabulator to re-filter
        if (isHeaderFilter) {
          const table = cell.getTable()
          if (table) {
            // Use refreshFilter to trigger headerFilterFunc
            table.refreshFilter()

            // Update all other headerFilters with cascade effect
            // Pass trigger field and its current value to prevent timing issues
            setTimeout(() => {
              updateAllHeaderFilterOptions(table, f, val)
            }, 10)
          }
        }
      })
    })

    //add editor to cell
    return editor
  }

  // Bilingual editor for Song Name and Artist (opens Modal)
  function bilingualEditor(cell, onRendered, success, cancel, editorParams) {
    const rowData = cell.getRow().getData()
    const field = editorParams.field // 'songName' or 'artist'
    const fieldLabel = editorParams.fieldLabel || field

    // Get current values
    const jaValue = rowData[field] || ''
    const enValue = rowData[field + 'En'] || ''

    // Setup Modal
    const modal = new bootstrap.Modal(document.getElementById('modalBilingualEdit'))

    // Set field label (both JA and EN fields use the same label)
    $('#bilingualFieldLabel').text(fieldLabel)
    $('#bilingualFieldLabel2').text(fieldLabel)

    // Set current values
    $('#bilingualJA').val(jaValue)
    $('#bilingualEN').val(enValue)

    // Handle save button
    $('#saveBilingual').off('click').on('click', async function() {
      const newJA = $('#bilingualJA').val()
      const newEN = $('#bilingualEN').val()

      // Update both fields via API
      try {
        const updateData = {
          [field]: newJA,
          [field + 'En']: newEN
        }

        await apiRequest('PUT', `${API_CONFIG.ENDPOINTS.songlist}/${rowData.songID}`, updateData)

        // Update row data
        rowData[field] = newJA
        rowData[field + 'En'] = newEN

        // Trigger table update
        const row = cell.getRow()
        row.update(rowData)

        modal.hide()

        // Force complete redraw of this row to recalculate height
        setTimeout(() => {
          row.reformat()

          // Success visual feedback after redraw
          setTimeout(() => {
            cell.getElement().style.backgroundColor = '#d4edda'
            setTimeout(() => {
              cell.getElement().style.backgroundColor = ''
            }, 1000)
          }, 50)
        }, 50)

        success(newJA) // Return primary language value
      } catch (error) {
        console.error('Error updating bilingual field:', error)
        alert(`Error: ${error.message}`)
        cancel()
      }
    })

    // Handle cancel/close
    $('#modalBilingualEdit').off('hidden.bs.modal').on('hidden.bs.modal', function() {
      cancel()
    })

    // Show modal
    modal.show()

    // Focus on first input
    setTimeout(() => $('#bilingualJA').focus(), 300)

    // Return empty div (modal-based editor doesn't need inline element)
    return document.createElement('div')
  }


  //set table
  function configJsonTable(u, p){
    var colDef

    if(p == 'setlist'){
      colDef=getSetlistColDef()
    }
    if(p == 'streamlist'){
      colDef=getStreamlistColDef()
    }
    if(p == 'songlist'){
      colDef=getSonglistColDef()
    }
    if(p == 'aliases'){
      colDef=getAliasesColDef()
    }

    // Error handling: if colDef is still undefined, show error message
    if(!colDef){
      console.error('[ERROR] Invalid table type:', p);
      $('#tb').html('<div class="alert alert-danger">Error: Invalid table type "' + p + '". Please reload the page.</div>');
      return;
    }

    // Initial view mode: remove editors to allow row selection
    const initialColDef = colDef.map(col => {
      const newCol = { ...col, editable: false }
      // Remove editors that would prevent row selection
      // For all tables: remove editor in non-edit mode
      if (col.editor) {
        const { editor, ...rest } = newCol
        return rest
      }
      return newCol
    })

    // ============================================
    // localStorage 快取優先載入機制
    // ============================================
    const cached = getCache(p)
    const hasCachedData = cached && cached.data && cached.data.length > 0

    // Tabulator 配置（總是設定 ajaxURL 供後續 setData() 使用）
    const tabulatorConfig = {
      ajaxURL: u,
      ajaxConfig: { cache: 'no-store' },
      ajaxResponse: function(url, params, response) {
        const data = response.data || response
        // 儲存到快取
        setCache(p, data)
        return data
      },
      height:700,
      columnDefaults:{
        headerFilter:"input",
      },
      columns:initialColDef,
      selectableRows:true,
      selectableRowsRangeMode:"click",
      clipboard:true,
      addRowPos:"top",
      downloadRowRange:'all'
    }

    // 如果有快取，使用快取資料初始化（秒開）
    // Tabulator 會優先使用 data 選項，ajaxURL 會被保留供後續 setData() 使用
    if (hasCachedData) {
      console.log(`[Cache] 使用快取資料初始化 ${p}，共 ${cached.data.length} 筆`)
      tabulatorConfig.data = cached.data
    } else {
      console.log(`[Cache] 無快取，從 API 載入 ${p}`)
    }

    jsonTable = new Tabulator("#tb", tabulatorConfig)

    // 如果使用快取載入，背景更新 API 資料
    if (hasCachedData) {
      backgroundFetchAndUpdate(u, p)
    }

    // 背景 fetch API 並更新表格
    async function backgroundFetchAndUpdate(apiUrl, tableType) {
      try {
        console.log(`[Cache] 背景更新 ${tableType}...`)
        const response = await fetch(apiUrl, { cache: 'no-store' })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const result = await response.json()
        const freshData = result.data || result

        // 比較資料是否有變化
        const cachedData = getCache(tableType)?.data || []
        if (!isDataEqual(cachedData, freshData)) {
          console.log(`[Cache] ${tableType} 資料已更新，重新載入表格`)
          // 更新快取
          setCache(tableType, freshData)
          // 更新表格
          jsonTable.setData(freshData)
        } else {
          console.log(`[Cache] ${tableType} 資料無變化`)
        }
      } catch (error) {
        console.error(`[Cache] 背景更新 ${tableType} 失敗:`, error)
        // 快取載入成功但背景更新失敗時，不影響用戶體驗
      }
    }

    // Listen for data processing events - data is ready for access via getData()
    jsonTable.on("dataProcessed", function(){
      const data = jsonTable.getData();
      // Store reference to processed data for getDynamicFieldData
      window.tableDataLoaded = true;

      // 初始化進階搜尋區塊
      initAdvancedSearch();

      // Re-initialize header filters after data is processed for dynamic field data
      if (p === 'streamlist' || p === 'setlist') {
        // Clear existing header filter
        jsonTable.clearHeaderFilter();
        // The header filters will be re-initialized automatically
      }
    });

    // Add context menu for streamlist (right-click menu)
    if (p === 'streamlist') {
      jsonTable.on("rowContext", function(e, row) {
        const data = row.getData();
        const categories = data.categories || [];

        // Only show menu for singing streams
        const isSingingStream = categories.some(cat =>
          cat.includes('歌枠') || cat.includes('Singing') || cat.includes('singing') || cat.includes('karaoke')
        );

        // Only prevent default context menu for singing streams
        // Non-singing streams will show browser's default menu
        if (!isSingingStream) {
          return;
        }

        e.preventDefault();

        showContextMenu(e.pageX, e.pageY, [
          {
            label: '📝 ' + t('補檔用 - 批次編輯歌單', 'Archive - Batch Edit Setlist', '補完用 - セットリスト一括編集'),
            action: () => openBatchEditor(data)
          },
          {
            label: '⚡ ' + t('直播用 - 快速新增歌單', 'Live - Quick Add Setlist', 'ライブ用 - クイック追加'),
            action: () => openQuickAdd(data)
          },
          { type: 'divider' },
          {
            label: '📋 ' + t('複製網址', 'Copy URL', 'URLをコピー'),
            action: async () => {
              const url = `https://youtube.com/watch?v=${data.streamID}`;
              try {
                await navigator.clipboard.writeText(url);
                // Optional: Show a brief success message
                console.log('URL copied to clipboard:', url);
              } catch (err) {
                console.error('Failed to copy URL:', err);
                // Fallback: create a temporary input element
                const input = document.createElement('input');
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
              }
            }
          },
          {
            label: '🎥 ' + t('查看 YouTube 影片', 'View YouTube Video', 'YouTube動画を見る'),
            action: () => window.open(`https://youtube.com/watch?v=${data.streamID}`, '_blank')
          }
        ]);
      });
    }

    // Add context menu for setlist (right-click menu to add alias)
    if (p === 'setlist') {
      jsonTable.on("rowContext", function(e, row) {
        e.preventDefault();

        const rowData = row.getData();

        showContextMenu(e.pageX, e.pageY, [
          {
            label: '➕ ' + t('新增別名', 'Add Alias', 'エイリアス追加'),
            action: () => {
              // Pre-fill Quick Add modal with song data
              $('#quickAliasType').val('artist')  // Default to artist
              $('#quickAliasValue').val(rowData.artist || '')  // Pre-fill with artist name
              $('#quickCanonicalName').val('').trigger('change')  // Empty for user to select
              $('#quickAliasNote').val('')  // Ensure note is empty

              // Store streamID and trackNo for later use
              $('#modalQuickAddAlias').data('streamID', rowData.streamID)
              $('#modalQuickAddAlias').data('trackNo', rowData.trackNo)
              $('#modalQuickAddAlias').data('songData', rowData)

              // Show modal
              new bootstrap.Modal('#modalQuickAddAlias').show()
            }
          }
        ]);
      });
    }

    // Add API sync events for immediate save
    jsonTable.on("cellEdited", async function(cell) {
      try {
        const rowData = cell.getRow().getData()
        const field = cell.getField()
        const value = cell.getValue()

        // Skip artist field ONLY in setlist (auto-updated by song selection)
        // In other pages, artist is manually editable and should sync
        if (p === 'setlist' && field === 'artist') {
          console.log('Artist field updated via song selection in setlist, skipping API sync')
          return
        }

        // Skip songName field ONLY in setlist (already synced in Select2 editor)
        // In other pages, songName uses normal input editor and should sync
        if (p === 'setlist' && field === 'songName') {
          console.log('Song field already synced in Select2 editor in setlist, skipping API sync')
          return
        }

        console.log(`Cell edited: ${field} = ${value}`)

        // Determine API endpoint and ID field
        let endpoint, idField, id
        if (p === 'songlist') {
          endpoint = API_CONFIG.ENDPOINTS.songlist
          idField = 'songID'
          id = rowData.songID
        } else if (p === 'streamlist') {
          endpoint = API_CONFIG.ENDPOINTS.streamlist
          idField = 'streamID'
          id = rowData.streamID
        } else if (p === 'setlist') {
          endpoint = API_CONFIG.ENDPOINTS.setlist
          // setlist uses composite key
          id = `${rowData.streamID}/${rowData.trackNo}`
        } else if (p === 'aliases') {
          endpoint = API_CONFIG.ENDPOINTS.aliases
          idField = 'aliasID'
          id = rowData.aliasID
        } else {
          console.log('No API sync for this table type')
          return
        }

        // Skip if no ID (new row not yet saved)
        if (!id) {
          console.log('No ID found, skipping API sync')
          return
        }

        // Map frontend field names to API field names
        const fieldMapping = {
          'segment': 'segmentNo',
          'track': 'trackNo'
        }
        const apiField = fieldMapping[field] || field

        // Handle timezone conversion for time field
        // mutator displays as Taiwan time (YYYY/MM/DD HH:mm)
        // Need to convert back to ISO 8601 UTC before sending to API
        let finalValue = value
        if (field === 'time') {
          const date = dayjs(value, 'YYYY/MM/DD HH:mm')
          finalValue = date.isValid() ? date.toISOString() : value
          console.log(`Time field converted: ${value} (local) → ${finalValue} (UTC)`)
        }

        // PUT update to API
        const updateData = { [apiField]: finalValue }
        await apiRequest('PUT', `${endpoint}/${id}`, updateData)

        // 更新 localStorage 快取
        const currentData = jsonTable.getData()
        setCache(p, currentData)
        console.log(`[Cache] 已更新 ${p} 快取`)

        // Show brief success indicator
        cell.getElement().style.backgroundColor = '#d4edda'
        setTimeout(() => {
          cell.getElement().style.backgroundColor = ''
        }, 1000)

      } catch (error) {
        console.error('Error syncing cell edit:', error)
        // Revert cell value on error
        cell.restoreOldValue()
        alert(`Error saving changes: ${error.message}`)
      }
    })

    jsonTable.on("rowDeleted", function(row) {
      // Row deleted from table - API delete is now handled in deleteRowOK handler
      // This event is only used for logging
      const rowData = row.getData()
      console.log('Row deleted from table:', rowData)

      // Show brief notification
      $('#setTableMsg').text(t({ zh: '資料已從表格移除', en: 'Data removed from table', ja: 'データがテーブルから削除されました' })).addClass('text-bg-info')
      setTimeout(() => {
        $('#setTableMsg').html('&emsp;').removeClass('text-bg-info')
      }, 2000)
    })
  }

  //--- jsonTable button block ---

  // === 進階搜尋功能 ===

  // 取得可搜尋的欄位列表（從 Tabulator 動態取得，只顯示 visible 欄位）
  function getSearchableFields() {
    if (!jsonTable) return []
    const cols = jsonTable.getColumnDefinitions()
    return cols
      .filter(col => col.field && col.title && col.visible !== false && !['thumbnail', 'YTLink'].includes(col.field))
      .map(col => ({ field: col.field, title: col.title }))
  }

  // 建立搜尋條件 HTML
  function createConditionRow() {
    const fields = getSearchableFields()
    const fieldOptions = fields.map(f =>
      `<option value="${f.field}">${f.title}</option>`
    ).join('')

    // Trilingual operator options
    let operatorOptions
    if (currentLang === 'ja') {
      operatorOptions = `
          <option value="contains">含む</option>
          <option value="equals">等しい</option>
          <option value="notContains">含まない</option>
          <option value="like">Like (%ワイルドカード)</option>
          <option value="keywords">キーワード</option>
          <option value="inArray">複数値</option>
          <option value="regex">正規表現</option>
      `
    } else if (currentLang === 'en') {
      operatorOptions = `
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="notContains">Not Contains</option>
          <option value="like">Like (% wildcard)</option>
          <option value="keywords">Keywords</option>
          <option value="inArray">Multi-value</option>
          <option value="regex">Regex</option>
      `
    } else {
      operatorOptions = `
          <option value="contains">包含</option>
          <option value="equals">等於</option>
          <option value="notContains">不包含</option>
          <option value="like">Like (%萬用)</option>
          <option value="keywords">關鍵字群</option>
          <option value="inArray">多值匹配</option>
          <option value="regex">正規表達式</option>
      `
    }

    const placeholder = t('例: HAPPY', 'e.g., HAPPY', '例: HAPPY')

    return `
      <div class="condition-row d-flex gap-2 mb-2 align-items-center">
        <select class="form-select form-select-sm field-select" style="width: 150px;">
          ${fieldOptions}
        </select>
        <select class="form-select form-select-sm operator-select" style="width: 130px;">
          ${operatorOptions}
        </select>
        <input type="text" class="form-control form-control-sm search-value flex-grow-1" placeholder="${placeholder}" style="min-width: 200px;">
        <button class="btn btn-outline-danger btn-sm remove-condition">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    `
  }

  // 初始化進階搜尋（表格載入後呼叫）
  function initAdvancedSearch() {
    const container = $('#searchConditions')
    if (container.length && container.children().length === 0) {
      container.append(createConditionRow())
    }
  }

  // 套用搜尋條件
  function applyAdvancedSearch() {
    const conditions = []
    const logic = $('input[name="searchLogic"]:checked').val() // 'and' or 'or'

    $('.condition-row').each(function() {
      const field = $(this).find('.field-select').val()
      const operator = $(this).find('.operator-select').val()
      const value = $(this).find('.search-value').val().trim()

      if (value) {
        conditions.push({ field, operator, value })
      }
    })

    if (conditions.length === 0) {
      jsonTable.clearFilter(true)
      return
    }

    // 建立自訂篩選函數
    const customFilter = (data) => {
      const results = conditions.map(cond => {
        const cellValue = String(data[cond.field] || '').toLowerCase()
        const searchValue = cond.value.toLowerCase()

        switch (cond.operator) {
          case 'contains':
            return cellValue.includes(searchValue)
          case 'equals':
            return cellValue === searchValue
          case 'notContains':
            return !cellValue.includes(searchValue)
          case 'like':
            // SQL LIKE 風格：% 匹配任意字元
            const likePattern = cond.value.replace(/%/g, '.*').replace(/_/g, '.')
            try {
              return new RegExp(`^${likePattern}$`, 'i').test(cellValue)
            } catch { return false }
          case 'keywords':
            // 空格分隔的關鍵字，全部必須匹配
            const keywords = cond.value.toLowerCase().split(/\s+/).filter(k => k)
            return keywords.every(kw => cellValue.includes(kw))
          case 'inArray':
            // 逗號分隔的值，任一匹配即可
            const values = cond.value.toLowerCase().split(',').map(v => v.trim()).filter(v => v)
            return values.some(v => cellValue === v || cellValue.includes(v))
          case 'regex':
            // 正規表達式
            try {
              return new RegExp(cond.value, 'i').test(cellValue)
            } catch { return false }
          default:
            return true
        }
      })

      // AND: 全部條件都要符合，OR: 任一條件符合即可
      return logic === 'and'
        ? results.every(r => r)
        : results.some(r => r)
    }

    jsonTable.setFilter(customFilter)

    // 顯示搜尋結果數量
    const count = jsonTable.getDataCount('active')
    const resultText = t(`搜尋結果：${count} 筆`, `Search results: ${count} rows`, `検索結果：${count} 件`)
    $('#setTableMsg').text(resultText).addClass('text-bg-info')
  }

  // 新增條件按鈕
  $('#content').on('click', '#addCondition', () => {
    $('#searchConditions').append(createConditionRow())
  })

  // 運算子變更時更新 placeholder
  function getOperatorPlaceholders() {
    if (currentLang === 'ja') {
      return {
        contains: '例: HAPPY',
        equals: '完全一致する値',
        notContains: 'このテキストを含む結果を除外',
        like: '例: H%Y (%=任意)',
        keywords: 'スペース区切り (例: happy train)',
        inArray: 'カンマ区切り (例: berry,莓)',
        regex: '例: ^H.*Y$'
      }
    } else if (currentLang === 'en') {
      return {
        contains: 'e.g., HAPPY',
        equals: 'Exact match value',
        notContains: 'Exclude results with this text',
        like: 'e.g., H%Y (%=any)',
        keywords: 'Space-separated (e.g., happy train)',
        inArray: 'Comma-separated (e.g., berry,莓)',
        regex: 'e.g., ^H.*Y$'
      }
    } else {
      return {
        contains: '例: HAPPY',
        equals: '完全符合的值',
        notContains: '排除含此文字的結果',
        like: '例: H%Y (%=任意)',
        keywords: '空格分隔 (例: happy train)',
        inArray: '逗號分隔 (例: berry,莓)',
        regex: '例: ^H.*Y$'
      }
    }
  }

  $('#content').on('change', '.operator-select', function() {
    const operator = $(this).val()
    const placeholders = getOperatorPlaceholders()
    const defaultPlaceholder = t('輸入搜尋值', 'Enter search value', '検索値を入力')
    const placeholder = placeholders[operator] || defaultPlaceholder
    $(this).closest('.condition-row').find('.search-value').attr('placeholder', placeholder)
  })

  // 移除條件按鈕
  $('#content').on('click', '.remove-condition', function() {
    const container = $('#searchConditions')
    if (container.children().length > 1) {
      $(this).closest('.condition-row').remove()
    }
  })

  // 套用搜尋按鈕
  $('#content').on('click', '#applySearch', () => {
    applyAdvancedSearch()
  })

  // 清除搜尋按鈕
  $('#content').on('click', '#clearSearch', () => {
    jsonTable.clearFilter(true)
    $('.search-value').val('')
    $('#setTableMsg').html('&emsp;').removeClass('text-bg-info')
  })

  // Enter 鍵觸發搜尋
  $('#content').on('keypress', '.search-value', (e) => {
    if (e.key === 'Enter') {
      applyAdvancedSearch()
    }
  })

  $('#content').on('click', '#reloadBtn', ()=>{
    jsonTable.setData()
    jsonTable.clearFilter(true)
    jsonTable.deselectRow()
    // 清除進階搜尋的輸入值
    $('.search-value').val('')
    $('#setTableMsg').html('&emsp;').removeClass('text-bg-info')
  })

  $('#content').on('click', '#edit', ()=>{
    $('.addRow').prop('disabled', !canEdit())
    $('#deleteRow').prop('disabled', canEdit())

    if(canEdit()){
      // 進入編輯模式：動態添加 editor
      // 從表格實例獲取當前列定義
      const currentColDef = jsonTable.getColumnDefinitions()

      // 安全檢查：確保 API 返回有效數組
      if (!Array.isArray(currentColDef) || currentColDef.length === 0) {
        console.error('[ERROR] Failed to get column definitions')
        return
      }

      const editableColDef = currentColDef.map(col => {
        // Songlist: Use bilingual editor for songName and artist
        if (getProcess() === 'songlist') {
          if (col.field === 'songName') {
            return {
              ...col,
              editor: bilingualEditor,
              editorParams: { field: 'songName', fieldLabel: t('歌名', 'Song Name', '曲名') },
              editable: true
            }
          }
          if (col.field === 'artist') {
            return {
              ...col,
              editor: bilingualEditor,
              editorParams: { field: 'artist', fieldLabel: t('歌手', 'Artist', 'アーティスト') },
              editable: true
            }
          }
        }

        // Setlist: Song 欄位使用 Select2 editor
        if (getProcess() === 'setlist' && col.field === 'songName') {
          return {
            ...col,
            editor: setlistSongSelect2Editor,
            editable: true
          }
        }
        // Artist 欄位在 setlist 保持唯讀（由 Select2 自動填入）
        // 在 streamlist 添加 editor（允許手動編輯）
        if (col.field === 'artist') {
          if (getProcess() === 'setlist') {
            return col  // No editor in setlist, auto-updated by song selection
          }
          // For streamlist, fall through to add default editor
        }
        // Streamlist: categories 欄位使用 Select2 editor（多選）
        if (getProcess() === 'streamlist' && col.field === 'categories') {
          return {
            ...col,
            editor: select2,
            editorParams: {field:'categories', multiple: true, tags: true},
            editable: true
          }
        }
        // songID 隱藏欄位不需要編輯
        if (col.field === 'songID') {
          return col  // Keep as is
        }
        // 已有 editor 的欄位保持不變
        if (col.editor) {
          return { ...col, editable: true }
        }
        // 其他欄位添加預設 input editor
        return { ...col, editor: "input", editable: true }
      })
      jsonTable.setColumns(editableColDef)
      jsonTable.showColumn("YTLink")
      jsonTable.deselectRow()

      // Show add new song button for setlist
      if (getProcess() === 'setlist') {
        $('#addNewSongInSetlist').show()
      }

      $('#setTableMsg').text(t({ zh: '點擊儲存格即可編輯', en: 'Click cell to edit', ja: 'セルをクリックして編集' })).addClass('text-bg-info')
    }
    else{
      // 離開編輯模式：恢復原始欄位定義（移除特定 editor 避免攔截點擊）
      // 從表格實例獲取當前列定義
      const currentColDef = jsonTable.getColumnDefinitions()

      // 安全檢查：確保 API 返回有效數組
      if (!Array.isArray(currentColDef) || currentColDef.length === 0) {
        console.error('[ERROR] Failed to get column definitions')
        return
      }

      const viewColDef = currentColDef.map(col => {
        const newCol = { ...col, editable: false }
        // 移除所有 editor 以允許正常的 row selection
        if (col.editor) {
          const { editor, ...rest } = newCol
          return rest
        }
        return newCol
      })
      jsonTable.setColumns(viewColDef)

      // 重新載入資料以確保與後端同步
      const currentProcess = getProcess()
      const endpoint = API_CONFIG.ENDPOINTS[currentProcess]
      if (endpoint) {
        console.log(`[Edit Mode] Reloading ${currentProcess} data from API after exiting edit mode`)
        apiRequest('GET', endpoint)
          .then(data => {
            jsonTable.setData(data)
            console.log(`[Edit Mode] Successfully reloaded ${data.length} rows`)
          })
          .catch(error => {
            console.error(`[Edit Mode] Failed to reload data:`, error)
            showError(`Failed to reload data: ${error.message}`)
          })
      }

      // Hide add new song button
      $('#addNewSongInSetlist').hide()
      //tell user editing completed
      $('#setTableMsg').text(t({ zh: '編輯完成', en: 'Edit complete', ja: '編集完了' })).addClass('text-bg-info')
      setTimeout(()=>{
        $('#setTableMsg').html('&emsp;').removeClass('text-bg-info')
      },5000)
    }
  })

  var addRowModal = new bootstrap.Modal(document.getElementById('modalAddRow'))
  document.getElementById('modalAddRow').addEventListener('shown.bs.modal', () => {
    $('#YTLink').focus()
  })

  var addSongModal = new bootstrap.Modal(document.getElementById('modalAddSong'))
  document.getElementById('modalAddSong').addEventListener('shown.bs.modal', () => {
    $('#songName').focus()
  })
    
  $('#content').on('click', '#addRow', ()=>{
    // Check which page type this is
    const currentPath = window.location.pathname.split('/').pop()

    if (currentPath === 'songlist') {
      // Reset form
      $('#modalAddSong form')[0].reset()

      // Destroy existing Select2 if present
      if ($('#artistName').hasClass('select2-hidden-accessible')) {
        $('#artistName').select2('destroy')
      }

      // Initialize AJAX Artist Select2
      initializeArtistSelect()

      // Open songlist modal
      addSongModal.show()
    } else {
      // Default: setlist modal
      //$('#setlistDate').val(dayjs().format('YYYY/MM/DD'))
      addRowModal.show()
    }
  })

  $('#addRowData').on('click', ()=>{
    let info = {d:$('#setlistDate').val(), y:$('#YTLink').val(), c:Number($('#songs').val())}

    jsonTable.blockRedraw()
    for(let i=info.c; i>0 ; i--){
      jsonTable.addRow({date:info.d, YTLink:info.y, track:i}, true)
    }
    jsonTable.restoreRedraw()
    jsonTable.redraw()
  })

  // songlist modal submit handler
  $('#addSongData').on('click', async ()=>{
    try {
      // Validate required fields
      const songName = $('#songName').val().trim()
      const artistName = $('#artistName').val().trim()

      if (!songName || !artistName) {
        alert('Please fill in required fields: Song Name and Artist')
        return
      }

      // Prepare song data
      const songData = {
        songName: songName,
        songNameEn: $('#songNameEn').val().trim() || null,
        artist: artistName,
        artistEn: $('#artistNameEn').val().trim() || null,
        genre: $('#genreName').val().trim() || null,
        tieup: $('#tieupName').val().trim() || null,
        songNote: $('#songNoteText').val().trim() || null
      }

      // Show loading state
      const submitBtn = $('#addSongData')
      const originalText = submitBtn.text()
      submitBtn.prop('disabled', true).text('Adding...')

      // POST to API
      const newSong = await apiRequest('POST', API_CONFIG.ENDPOINTS.songlist, songData)

      // Only add to table if we're on the songlist page
      const currentPath = window.location.pathname.split('/').pop()
      if (currentPath === 'songlist' && jsonTable) {
        jsonTable.addRow(newSong, true)
        // 更新 localStorage 快取
        const currentData = jsonTable.getData()
        setCache('songlist', currentData)
        console.log('[Cache] 已更新 songlist 快取（新增後）')
      }

      // Close modal and reset form
      addSongModal.hide()
      $('#modalAddSong form')[0].reset()

      // Show success message only if on songlist page
      if (currentPath === 'songlist') {
        $('#setTableMsg').text(t({ zh: '歌曲新增成功', en: 'Song added successfully', ja: '曲の追加に成功しました' })).addClass('text-bg-success')
        setTimeout(() => {
          $('#setTableMsg').html('&emsp;').removeClass('text-bg-success')
        }, 3000)
      }

    } catch (error) {
      console.error('Error adding song:', error)
      alert(`Error adding song: ${error.message}`)
    } finally {
      // Reset button state
      $('#addSongData').prop('disabled', false).text('Add Song')
    }
  })

  $('#content').on('click', '#deleteRow', ()=>{
      let selectedRows = jsonTable.getSelectedRows()
      $('#modalFooter').empty()
      if(selectedRows == 0 ){
        $('#modalMsg').html("No selected row")
        $('#modalFooter').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">OK</button>`)
      }
      else{
        $('#modalMsg').html("Delete?")
        $('#modalFooter').append(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="deleteRowCancel">Cancel</button>
                                  <button type="button" class="btn btn-danger" id="deleteRowOK">OK</button>`)
      }
      msgModal.show()
  })

  $('#modalFooter').on('click', '#deleteRowOK', async ()=>{
    const selectedRows = jsonTable.getSelectedRows()
    const p = getProcess()

    // 1. 顯示 loading 狀態
    $('#modalMsg').html(`
      <div class="text-center">
        <div class="spinner-border text-danger mb-3" role="status">
          <span class="visually-hidden">Deleting...</span>
        </div>
        <p class="mb-2">正在刪除 ${selectedRows.length} 筆資料...</p>
        <p class="small text-muted">請稍候，正在檢查資料關聯性</p>
      </div>
    `)
    $('#modalFooter').empty()  // 移除按鈕防止重複點擊

    // 2. 確定 API endpoint
    let endpoint
    if (p === 'songlist') {
      endpoint = API_CONFIG.ENDPOINTS.songlist
    } else if (p === 'streamlist') {
      endpoint = API_CONFIG.ENDPOINTS.streamlist
    } else if (p === 'setlist') {
      endpoint = API_CONFIG.ENDPOINTS.setlist
    } else if (p === 'aliases') {
      endpoint = API_CONFIG.ENDPOINTS.aliases
    } else {
      // 不支援 API 的表格，直接刪除
      jsonTable.blockRedraw()
      selectedRows.forEach(row => row.delete())
      jsonTable.restoreRedraw()
      msgModal.hide()
      return
    }

    // 3. 逐一呼叫 API 驗證並刪除
    const results = []
    for (let i = 0; i < selectedRows.length; i++) {
      const row = selectedRows[i]
      const rowData = row.getData()

      // 更新進度
      $('#modalMsg').html(`
        <div class="text-center">
          <div class="spinner-border text-danger mb-3" role="status"></div>
          <p class="mb-2">正在刪除 ${i + 1} / ${selectedRows.length} ...</p>
          <p class="small text-muted">${rowData.title || rowData.songName || rowData.streamID || ''}</p>
        </div>
      `)

      // 確定 ID
      let id
      if (p === 'songlist') {
        id = rowData.songID
      } else if (p === 'streamlist') {
        id = rowData.streamID
      } else if (p === 'setlist') {
        id = `${rowData.streamID}/${rowData.trackNo}`
      } else if (p === 'aliases') {
        id = rowData.aliasID
      }

      if (!id) {
        results.push({ row, success: false, error: 'No ID found' })
        continue
      }

      // 呼叫 API DELETE
      try {
        await apiRequest('DELETE', `${endpoint}/${id}`)
        results.push({ row, success: true, data: rowData })
      } catch (error) {
        results.push({ row, success: false, error: error.message, data: rowData })
      }
    }

    // 4. 只刪除成功的 rows
    jsonTable.blockRedraw()
    results.forEach(r => {
      if (r.success) {
        r.row.delete()
      }
    })
    jsonTable.restoreRedraw()

    // 更新 localStorage 快取（刪除成功的資料後）
    if (results.some(r => r.success)) {
      const currentData = jsonTable.getData()
      setCache(p, currentData)
      console.log(`[Cache] 已更新 ${p} 快取（刪除後）`)
    }

    // 5. 顯示結果
    const successCount = results.filter(r => r.success).length
    const failCount = results.length - successCount

    if (failCount > 0) {
      const failedRows = results.filter(r => !r.success)
      const errorDetails = failedRows.map(r => {
        const name = r.data?.title || r.data?.songName || r.data?.streamID || 'Unknown'
        return `<li><strong>${name}</strong>: ${r.error}</li>`
      }).join('')

      $('#modalMsg').html(`
        <div class="alert alert-warning mb-0">
          <h6 class="alert-heading">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            部分刪除失敗
          </h6>
          <p class="mb-2">
            <span class="badge bg-success">${successCount} 筆成功</span>
            <span class="badge bg-danger ms-2">${failCount} 筆失敗</span>
          </p>
          ${failCount <= 5 ? `
            <hr>
            <p class="mb-2"><strong>失敗原因：</strong></p>
            <ul class="mb-0 small">${errorDetails}</ul>
          ` : `
            <hr>
            <p class="mb-0 small"><strong>常見原因：</strong>該項目仍被其他資料引用（例如 streamlist 有關聯的 setlist）</p>
          `}
        </div>
      `)
    } else {
      $('#modalMsg').html(`
        <div class="alert alert-success mb-0">
          <h6 class="alert-heading">
            <i class="bi bi-check-circle-fill me-2"></i>
            刪除成功
          </h6>
          <p class="mb-0">成功刪除 ${successCount} 筆資料</p>
        </div>
      `)
    }

    $('#modalFooter').html(`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>`)
  })


  $('#modalFooter').on('click', '#dlData', ()=>{
    $('#dljson').click()
    $('#modalFooter').empty()
  })


  $('#content').on('click', '#dlcsv', ()=>{
    let filename=getProcess()
    jsonTable.download('csv', filename + '.csv', {delimiter:";", bom:true})
  })

  $('#content').on('click', '#dljson', ()=>{
    let filename=getProcess()
    jsonTable.download('json', filename + '.json')
  })

  $('#setlistDate').on('blur', (e)=>{
    let d = dayjs(e.target.value)
    if(!d.isValid()){
      $('#dateCheck').text('Date not valid')
      $('#setlistDate').trigger( "focus" )
    }
    else{
      $('#dateCheck').text('')
      //e.target.value=d.format('YYYY/MM/DD HH:mm')
    }
  })

  $('#YTLink').on('blur', async ()=>{
    fillVedioInfo($('#YTLink'))
  })

  //for streamlist (quick solution)

  var addStreamRowModal = new bootstrap.Modal(document.getElementById('modalAddStreamRow'))
  document.getElementById('modalAddStreamRow').addEventListener('shown.bs.modal', () => {
    $('#YTID').focus()
  })
  

  $('#content').on('click', '#addStreamRow', ()=>{
    $('.form-control').val('')

    // Check if table data is loaded
    if (!window.tableDataLoaded || !jsonTable) {
      alert('Please wait for table data to load before adding new rows.');
      return;
    }

    // Initialize select2 for category with dynamic data
    $('#category').empty()
    if ($('#category').hasClass('select2-hidden-accessible')) {
      $('#category').select2('destroy')
    }

    let categoryData = getDynamicFieldData(jsonTable, 'categories')
    console.log('Modal category data:', categoryData)

    if (categoryData.length === 0) {
      console.warn('No category data available, allow tags only');
    }

    $('#category').select2({
      data: categoryData,
      allowClear: true,
      tags: true,  // Restored: Allow creating new categories
      multiple: true,  // Restored: Allow multiple selection
      width: '100%',
      dropdownParent: $('#modalAddStreamRow'),
      placeholder: categoryData.length === 0 ? t('輸入分類...', 'Type to add categories...', 'カテゴリを入力...') : t('選擇或輸入分類...', 'Select or type categories...', 'カテゴリを選択または入力...')
    })

    // Set default category (Stage B-2: array for multiple mode)
    $('#category').val(['歌枠 / Singing']).trigger('change');

    $('#streamTitle').prop('disabled', true)
    $('#streamTime').prop('disabled', true)
    addStreamRowModal.show()
  })

  $('#YTID').on('blur', async ()=>{
    fillVedioInfo($('#YTID'))
  })

  function fillVedioInfo(obj){
    // query youtube api get info
    // You can use your API key to query the info
    // https://developers.google.com/youtube/v3/getting-started
    // if you have api key then decomment the following code
    // and comment url:'https://getytvideoinfo.katani.workers.dev/?id='+id, decomment url:url

    /* const YOUTUBEAPIKEY = 'YOUR_YOUTUBE_API_KEY'
     let url = https://www.googleapis.com/youtube/v3/videos?key=' + YOUTUBEAPIKEY 
           + '&part=id,snippet,liveStreamingDetails'
           + '&fields=items(id,snippet(publishedAt,channelId,title),liveStreamingDetails(scheduledStartTime))'
           + '&id='+id
    */
    
    const BERRYCHANNEL = ['UC7A7bGRVdIwo93nqnA3x-OQ', 'UCBOGwPeBtaPRU59j8jshdjQ', 'UC2cgr_UtYukapRUt404In-A']

    let id = getYoutubeVideoId(obj.val())
    if(id === undefined) return

    //load content
    $.ajax({
      url:'https://getytvideoinfo.katani.workers.dev/?id='+id,
      //url:url
      })
      .done((d, textStatus, request)=>{
        let info = d.items[0]
        let isBerryChannel = BERRYCHANNEL.filter(e=>info.snippet.channelId.includes(e))
        //berry's video?
        if( isBerryChannel.length > 0 ){
          let title = info.snippet.title
          $('#streamMsg').html("　")
          $('#streamTitle').val(title)

          $('#streamTime').val(info.time)
          $('#setlistDate').val(info.time)
          
          $('#videoID').val(id)
          $('#category').val(preCategory(title)).trigger('change');
        }
        else{
          // 非berry頻道，在當前modal內顯示確認按鈕
          $('#streamMsg').html(`
            <div class="text-warning">⚠️ 非berry頻道 確認要新增?</div>
            <div class="mt-2">
              <button type="button" class="btn btn-sm btn-secondary me-2" id="cancelNonBerry">取消</button>
              <button type="button" class="btn btn-sm btn-primary" id="confirmNonBerry">確認</button>
            </div>
          `)

          // 暫存影片資訊供確認後使用
          $('#YTID').data('tempVideoInfo', {
            info: info,
            id: id
          })
        }    
      })
      .fail((jqXHR, textStatus)=>{
        $('#streamMsg').html("Get video info fail.")
        $('#streamTitle').prop('disabled', false)
        $('#streamTime').prop('disabled', false)
      })
  }
  
  $('#streamTime').on('blur', (e)=>{
    if(e.target.value.length == 0) return
    e.target.value = dayjs(e.target.value).format('YYYY-MM-DD HH:mm:00.000Z')
  })

  $('#addStreamRowData').on('click', async (e)=>{
      // Select2 multiple already returns array format
      const categories = $('#category').val() || [];
      const streamID = $('#videoID').val()
      const title = $('#streamTitle').val()
      const time = dayjs($('#streamTime').val()).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
      const note = null

      // 隱藏之前的錯誤訊息
      $('#addStreamRowError').hide()

      // 先送資料庫驗證
      try {
        // 顯示載入狀態
        $('#addStreamRowData').prop('disabled', true).text('新增中...')

        // 先呼叫 API 新增到資料庫
        const result = await apiRequest('POST', API_CONFIG.ENDPOINTS.streamlist, {
          streamID: streamID,
          title: title,
          time: time,
          categories: categories,
          note: note
        }, {
          headers: { 'X-Source': 'user' }
        })

        console.log('✅ Streamlist entry created:', result)

        // API 成功後才加入 Tabulator 表格
        jsonTable.addRow({
          streamID: streamID,
          title: title,
          time: time,
          categories: categories,
          note: note
        }, true)

        // 更新 localStorage 快取
        const currentData = jsonTable.getData()
        setCache('streamlist', currentData)
        console.log('[Cache] 已更新 streamlist 快取（新增後）')

        // 關閉 Modal（✅ 成功時才關閉）
        addStreamRowModal.hide()

        // 清空表單
        $('.form-control').val('')
        $('#category').val([]).trigger('change')

        // 恢復按鈕狀態
        $('#addStreamRowData').prop('disabled', false).text('Add')

      } catch (error) {
        // API 失敗處理
        console.error('Failed to create streamlist entry:', error)

        // 恢復按鈕狀態
        $('#addStreamRowData').prop('disabled', false).text('Add')

        // 處理特定錯誤並顯示在 Modal 內
        const errorMsg = error.message || String(error)
        let errorDetail = ''

        if (errorMsg.includes('already exists') || errorMsg.includes('Conflict')) {
          errorDetail = `此直播已存在<br><small>StreamID "<strong>${streamID}</strong>" 已在資料庫中，請使用其他影片</small>`
        } else if (errorMsg.includes('400') || errorMsg.includes('VALIDATION')) {
          errorDetail = `資料格式錯誤<br><small>請檢查必填欄位是否填寫完整</small>`
        } else if (errorMsg.includes('timeout') || errorMsg.includes('NetworkError')) {
          errorDetail = `網路連線錯誤<br><small>請檢查網路連線或 Hyperdrive 服務是否啟動</small>`
        } else {
          errorDetail = `${errorMsg}<br><small>請檢查輸入資料或聯繫管理員</small>`
        }

        // 在 Modal 內顯示錯誤訊息
        $('#addStreamRowErrorMsg').html(errorDetail)
        $('#addStreamRowError').show()

        // 自動捲動到錯誤訊息（讓使用者看到）
        $('#addStreamRowError')[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' })

        // ⚠️ Modal 保持開啟，讓使用者可以修改資料後重試
      }
    })

  // 處理非berry頻道確認按鈕
  $(document).on('click', '#confirmNonBerry', (e)=>{
    console.log('確認按鈕被點擊') // 調試輸出
    let tempData = $('#YTID').data('tempVideoInfo')
    console.log('暫存資料:', tempData) // 調試輸出

    if (tempData) {
      let {info, id} = tempData
      let title = info.snippet.title

      // 填入影片資訊 (與berry頻道相同邏輯)
      $('#streamMsg').html("　")
      $('#streamTitle').val(title).prop('disabled', false)
      $('#streamTime').val(info.time).prop('disabled', false)
      $('#setlistDate').val(info.time)
      $('#videoID').val(id)
      $('#category').val(preCategory(title)).trigger('change')

      console.log('影片資訊已填入') // 調試輸出
      // 清除暫存資料
      $('#YTID').removeData('tempVideoInfo')
    }
  })

  // 處理非berry頻道取消按鈕
  $(document).on('click', '#cancelNonBerry', (e)=>{
    console.log('取消按鈕被點擊') // 調試輸出

    // 清空輸入框並重新獲得焦點
    $('#YTID').val('').focus()
    $('#streamMsg').html("已取消新增")

    // 清除暫存資料
    $('#YTID').removeData('tempVideoInfo')
  })
  //--- Aliases Page Handlers ---

  // Add Alias button - open quick add modal
  $('#content').on('click', '#addAlias', () => {
    $('#quickAliasType').val('artist')
    $('#quickCanonicalName').val('')
    $('#quickAliasValue').val('')
    $('#quickAliasNote').val('')
    new bootstrap.Modal('#modalQuickAddAlias').show()
  })

  // Batch Add Aliases button
  $('#content').on('click', '#batchAddAliases', () => {
    $('#batchAliasType').val('artist')
    $('#batchAliasJSON').val('')
    new bootstrap.Modal('#modalBatchAddAliases').show()
  })

  // Test Alias button
  $('#content').on('click', '#testAlias', () => {
    $('#testAliasType').val('artist')
    $('#testAliasInput').val('')
    $('#testAliasResults').hide()
    $('#testAliasResultsContent').empty()
    new bootstrap.Modal('#modalTestAlias').show()
  })

  // Quick Add Alias: Initialize Select2 and load options
  $('#modalQuickAddAlias').on('shown.bs.modal', async function() {
    // Initialize Select2 for canonical name dropdown
    if (!$('#quickCanonicalName').data('select2')) {
      $('#quickCanonicalName').select2({
        dropdownParent: $('#modalQuickAddAlias'),
        width: '100%',
        placeholder: t('請選擇...', 'Select...', '選択してください...'),
        allowClear: true
      })
    }

    // Load initial options based on current type
    await loadQuickAddOptions()
  })

  // Quick Add Alias: Update options when type changes
  $('#quickAliasType').on('change', async function() {
    await loadQuickAddOptions()

    // Auto-update alias value based on new type
    const aliasType = $(this).val()
    const songData = $('#modalQuickAddAlias').data('songData')

    if (songData) {
      if (aliasType === 'artist') {
        $('#quickAliasValue').val(songData.artist || '')
      } else if (aliasType === 'title') {
        $('#quickAliasValue').val(songData.songName || '')
      }
    }
  })

  // Function to load canonical name options for Quick Add
  async function loadQuickAddOptions() {
    const aliasType = $('#quickAliasType').val()

    try {
      // Fetch songlist data from API
      const response = await apiRequest('GET', API_CONFIG.ENDPOINTS.songlist)
      const songlist = response.data || response

      // Extract unique canonical names based on type
      let options = []
      if (aliasType === 'artist') {
        // Get unique artist names
        const artists = new Set()
        songlist.forEach(song => {
          if (song.artist) artists.add(song.artist)
        })
        options = Array.from(artists).sort()
      } else {
        // Get unique song titles
        const titles = new Set()
        songlist.forEach(song => {
          if (song.songName) titles.add(song.songName)
        })
        options = Array.from(titles).sort()
      }

      // Update select options
      const $select = $('#quickCanonicalName')
      $select.empty()
      $select.append(`<option value="">${t('請選擇...', 'Select...', '選択してください...')}</option>`)
      options.forEach(option => {
        $select.append(`<option value="${option}">${option}</option>`)
      })

      // Trigger Select2 to refresh
      $select.trigger('change.select2')

    } catch (error) {
      console.error('Error loading canonical names:', error)
      alert(`❌ 無法載入選項 (Failed to load options): ${error.message}`)
    }
  }

  // Helper function to show alerts in Quick Add Alias Modal
  function showQuickAliasAlert(message, type = 'info') {
    const alertContainer = $('#quickAliasAlert')
    const alertClass = type === 'success' ? 'alert-success' : type === 'danger' ? 'alert-danger' : 'alert-info'

    alertContainer.html(`
      <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `).show()

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        const alertEl = alertContainer.find('.alert')[0]
        if (alertEl) {
          const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl)
          bsAlert.close()
        }
        alertContainer.hide()
      }, 5000)
    }
  }

  // Save Quick Alias
  $('#saveQuickAlias').on('click', async () => {
    const aliasType = $('#quickAliasType').val()
    const canonicalName = $('#quickCanonicalName').val().trim()
    const aliasValue = $('#quickAliasValue').val().trim()
    const note = $('#quickAliasNote').val().trim()

    // Validation
    if (!canonicalName || !aliasValue) {
      showQuickAliasAlert('請填寫標準名稱和別名 (Canonical Name and Alias are required)', 'danger')
      return
    }

    try {
      // Disable button during request
      $('#saveQuickAlias').prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Adding...')

      const result = await apiRequest('POST', API_CONFIG.ENDPOINTS.aliasesQuickAdd, {
        aliasType,
        canonicalName,
        aliasValue,
        note: note || null
      })

      // Reload table if on aliases page
      if (getProcess() === 'aliases') {
        jsonTable.setData()
      }

      // Show success message
      showQuickAliasAlert(`✅ 別名新增成功 (Alias added successfully)<br><br><strong>類型:</strong> ${aliasType}<br><strong>標準名稱:</strong> ${canonicalName}<br><strong>別名:</strong> ${aliasValue}`, 'success')

      // Clear form for next entry
      $('#quickCanonicalName').val('').trigger('change')
      $('#quickAliasValue').val('')
      $('#quickAliasNote').val('')

    } catch (error) {
      console.error('Error adding alias:', error)
      showQuickAliasAlert(`❌ 新增失敗 (Failed to add alias): ${error.message}`, 'danger')
    } finally {
      $('#saveQuickAlias').prop('disabled', false).html('<i class="bi bi-plus-circle"></i> Add')
    }
  })

  // Save Batch Aliases
  $('#saveBatchAliases').on('click', async () => {
    const aliasType = $('#batchAliasType').val()
    const jsonText = $('#batchAliasJSON').val().trim()

    // Validation
    if (!jsonText) {
      alert('請輸入 JSON 資料 (Please enter JSON data)')
      return
    }

    let jsonData
    try {
      jsonData = JSON.parse(jsonText)
    } catch (error) {
      alert(`❌ JSON 格式錯誤 (Invalid JSON format):\n${error.message}`)
      return
    }

    // Validate JSON structure
    if (typeof jsonData !== 'object' || jsonData === null) {
      alert('❌ JSON 必須是物件格式 (JSON must be an object)\n\n正確格式：{"標準名稱": ["別名1", "別名2"]}')
      return
    }

    // Convert JSON object to aliases array
    const aliases = []
    for (const [canonicalName, aliasValues] of Object.entries(jsonData)) {
      if (!Array.isArray(aliasValues)) {
        alert(`❌ 錯誤：「${canonicalName}」的值必須是陣列 (Value must be an array)\n\n正確格式：{"${canonicalName}": ["別名1", "別名2"]}`)
        return
      }
      for (const aliasValue of aliasValues) {
        if (typeof aliasValue !== 'string' || !aliasValue.trim()) {
          alert(`❌ 錯誤：別名值必須是非空字串 (Alias value must be a non-empty string)`)
          return
        }
        aliases.push({
          aliasType,
          canonicalName: canonicalName.trim(),
          aliasValue: aliasValue.trim(),
          note: null
        })
      }
    }

    if (aliases.length === 0) {
      alert('沒有要新增的別名 (No aliases to add)')
      return
    }

    try {
      // Disable button during request
      $('#saveBatchAliases').prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Uploading...')

      const result = await apiRequest('POST', API_CONFIG.ENDPOINTS.aliasesBatch, { aliases })

      // Validate response (apiRequest already unpacks result.data)
      if (!result || typeof result.total === 'undefined') {
        throw new Error('API 返回格式錯誤 (Invalid API response)')
      }

      // Close modal
      bootstrap.Modal.getInstance('#modalBatchAddAliases').hide()

      // Reload table if on aliases page
      if (getProcess() === 'aliases') {
        jsonTable.setData()
      }

      // Show success message
      const summary = result
      alert(`✅ 批次新增完成 (Batch add completed)\n\n總數: ${summary.total}\n成功新增: ${summary.inserted}\n已存在（更新）: ${summary.updated}${summary.errors ? `\n錯誤: ${summary.errors.length}` : ''}`)

    } catch (error) {
      console.error('Error batch adding aliases:', error)
      alert(`❌ 批次新增失敗 (Batch add failed): ${error.message}`)
    } finally {
      $('#saveBatchAliases').prop('disabled', false).html('<i class="bi bi-upload"></i> Upload')
    }
  })

  // Setlist: Add Alias button click handler
  $('#content').on('click', '.add-alias-btn', function() {
    const streamID = $(this).data('streamid')
    const trackNo = $(this).data('trackno')

    // Find the row data from table
    const rows = jsonTable.getData()
    const rowData = rows.find(r => r.streamID === streamID && r.trackNo === trackNo)

    if (!rowData) {
      alert('無法找到該歌曲資料 (Cannot find song data)')
      return
    }

    // Determine alias type based on what's missing
    // If both are present, default to title
    let aliasType = 'title'
    let canonicalName = ''
    let aliasValue = ''

    // Pre-fill canonical name with the parsed value from setlist
    // User needs to manually input the correct canonical name from database
    if (rowData.songName) {
      aliasType = 'title'
      canonicalName = '' // User should fill this with the correct song name from database
      aliasValue = rowData.songName
    } else if (rowData.artist) {
      aliasType = 'artist'
      canonicalName = '' // User should fill this with the correct artist name from database
      aliasValue = rowData.artist
    }

    // Open modal with pre-filled values
    $('#quickAliasType').val(aliasType)
    $('#quickCanonicalName').val(canonicalName)
    $('#quickAliasValue').val(aliasValue)
    $('#quickAliasNote').val(`From setlist: ${rowData.streamID} track ${rowData.trackNo}`)

    new bootstrap.Modal('#modalQuickAddAlias').show()

    // Show instruction alert
    setTimeout(() => {
      alert(`💡 使用說明 (Instructions):\n\n1. 請在「標準名稱」欄位填入資料庫中正確的歌名/歌手名稱\n   (Enter the correct song/artist name from the database in "Canonical Name")\n\n2. 「別名」欄位已預填歌單中的名稱\n   (The "Alias" field is pre-filled with the name from setlist)\n\n3. 確認無誤後點擊 Add 即可新增別名\n   (Click Add to save the alias mapping)`)
    }, 300)
  })

  // Run Test Alias
  $('#runTestAlias').on('click', async () => {
    const aliasType = $('#testAliasType').val()
    const inputText = $('#testAliasInput').val().trim()

    if (!inputText) {
      alert('請輸入測試文字 (Please enter input text)')
      return
    }

    try {
      // Disable button during request
      $('#runTestAlias').prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Testing...')

      const result = await apiRequest('POST', API_CONFIG.ENDPOINTS.aliasesTest, {
        aliasType,
        inputText
      })

      // Display results
      const data = result.data
      if (data.matches.length === 0) {
        $('#testAliasResultsContent').html('<div class="alert alert-info">沒有找到匹配的別名 (No matches found)</div>')
      } else {
        let html = `<p class="mb-2">找到 ${data.matchCount} 個匹配 (Found ${data.matchCount} matches):</p>`
        html += '<div class="list-group">'
        for (const match of data.matches) {
          html += `
            <div class="list-group-item">
              <h6 class="mb-2"><strong>${match.canonicalName}</strong></h6>
              <div class="ms-3">
                ${match.aliases.map(a => `
                  <div class="small">
                    • ${a.value}
                    ${a.note ? `<span class="text-muted">(${a.note})</span>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `
        }
        html += '</div>'
        $('#testAliasResultsContent').html(html)
      }

      $('#testAliasResults').show()

    } catch (error) {
      console.error('Error testing alias:', error)
      alert(`❌ 測試失敗 (Test failed): ${error.message}`)
    } finally {
      $('#runTestAlias').prop('disabled', false).html('<i class="bi bi-search"></i> Test')
    }
  })


//--- json table ---

function getProcess(){
  //get what page the user in
  let p = location.pathname.slice(1)
  return (p.length==0? null:p)
}

function getYoutubeVideoId(url){
  //trim the https://www.youtube.com/watch?v=abcdefg to abcdefg
  // for 2023 the ID length is 11
  
  let ytPrefix = ['https://www.youtube.com/watch?v=','https://www.youtube.com/live/','https://youtu.be/','https://youtube.com/shorts/']
  let idLength = 11
  let prefix = ytPrefix.filter(e=>url.includes(e))
  let id=''

  if(url.length == idLength){
    // assume input id
    return url
  }

  if(prefix.length==0) {
    $('#streamMsg').text('url not start from ' + ytPrefix[0] )
    return
  }

  id = url.slice(prefix[0].length, prefix[0].length + idLength)
  
  //test id length
  if (id.length < idLength){
    $('#streamMsg').text('videoID length not ' + idLength )
  }
  else{
    return id
  }
}

function preCategory(t){
  //when user add streamlist, pre-category
  //Returns ALL matching categories (not just first match)
  let origin = ['xfd', 'オリジナル', 'music video']
  let chat = ['chat', 'talk', '雑談']
  let categories = []

  if(t.includes('歌枠')){
    categories.push('歌枠 / Singing')
  }
  if(t.toLowerCase().includes('gam')){
    categories.push('ゲーム / Gaming')
  }
  if(t.toLowerCase().includes('short')){
    categories.push('ショート / Shorts')
  }
  if(t.toLowerCase().includes('歌ってみた')){
    categories.push('歌ってみた動画 / Cover movie')
  }
  if(origin.some(e=>t.toLowerCase().includes(e))){
    categories.push('オリジナル曲 / Original Songs')
  }
  if(chat.some(e=>t.toLowerCase().includes(e))){
    categories.push('雑談 / Chatting')
  }

  // If no categories matched, return 'other'
  return categories.length > 0 ? categories : ['other']
}

async function getLatest(){
  try {
    const [ytLatest, dataUpdates, gitCommitMsg] = await Promise.all([
      getYTlatest(),
      getDataUpdates(),
      getGitCommitMsg()
    ])
    // Two-column layout: video on left, updates on right
    return `
    <div class="row mt-3">
      <div class="col-lg-6 col-md-12 mb-3">
        ${ytLatest}
      </div>
      <div class="col-lg-6 col-md-12">
        ${dataUpdates}
        ${gitCommitMsg}
      </div>
    </div>
    `
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Get database last updated times
function getDataUpdates(){
  return new Promise((resolve, reject)=>{
    $.ajax({
      url: API_CONFIG.BASE_URL + '/stats/last-updated',
    })
    .done((response)=>{
      if (!response.success || !response.data) {
        resolve('')
        return
      }
      const d = response.data
      const formatDate = (dateStr) => dateStr ? dayjs(dateStr).format('YYYY/MM/DD HH:mmZ') : '-'
      let html = `
      <div class="mb-3 pb-3 border-bottom">
        <h6>Data Updates</h6>
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 0.5rem;">
          <span>streamlist:</span><span>${formatDate(d.streamlist)}</span>
          <span>setlist:</span><span>${formatDate(d.setlist)}</span>
          <span>songlist:</span><span>${formatDate(d.songlist)}</span>
        </div>
      </div>
      `
      resolve(html)
    })
    .fail((err)=>{
      console.error('Failed to fetch data updates:', err)
      resolve('')
    });
  })
}

//get berry latest public video
function getYTlatest(){
  return new Promise((resolve, reject)=>{
    $.ajax({
      url:'https://getytvideoinfo.katani.workers.dev/latest'
    })
    .done((d)=>{
      let v = d.items[0].snippet
      let html =`
      <div id='YTlatest' class='card'>
        <a href="https://www.youtube.com/watch?v=${v.resourceId.videoId}" class="card-link"><img src="${v.thumbnails.medium.url}" class="card-img-top"></a>
        <div class="card-body">
          <h5 class="card-title">Latest Public Video</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">publish @ ${dayjs(v.publishedAt).format('YYYY/MM/DD HH:mmZ')}</h6>
          <a href="https://www.youtube.com/watch?v=${v.resourceId.videoId}" class="card-link">${v.title}</a>
        </div>
      </div>
      `
      resolve(html)
    })
    .fail((err)=>{reject(err)});
  })
}

  //--- Batch Editor Event Handlers ---
  $('#generateBatchTable').on('click', function() {
    const startTrack = parseInt($('#batchStartTrack').val()) || 1
    const totalSongs = parseInt($('#batchTotalSongs').val()) || 20
    const segment = parseInt($('#batchSegment').val()) || 1

    // Generate empty rows (segment is shared for all, not per-row)
    const rows = []
    for (let i = 0; i < totalSongs; i++) {
      rows.push({
        trackNo: startTrack + i,
        songID: null,
        songDisplay: '',
        note: ''
      })
    }

    // Destroy previous table if exists
    if (batchTable) {
      batchTable.destroy()
    }

    // Create batch edit table with Movable Rows
    batchTable = new Tabulator("#batchTableContainer", {
      data: rows,
      layout: "fitColumns",
      movableRows: true,
      columns: [
        {title: "Track", field: "trackNo", width: 80, editor: false},
        {
          title: "Song (歌名 - 歌手)",
          field: "songID",
          editor: batchSongSelect2Editor,
          formatter: songDisplayFormatter,
          headerSort: false,
          widthGrow: 3
        },
        {
          title: "Note",
          field: "note",
          editor: "input",
          headerSort: false,
          widthGrow: 2
        }
      ]
    })

    // Update track numbers on row move
    batchTable.on("rowMoved", recalculateTrackNumbers)

    // Update track numbers when start track changes
    $('#batchStartTrack').off('change').on('change', function() {
      if (batchTable) {
        recalculateTrackNumbers()
      }
    })
  })

  function recalculateTrackNumbers() {
    const startTrack = parseInt($('#batchStartTrack').val()) || 1
    const rows = batchTable.getRows()

    rows.forEach((row, index) => {
      row.update({ trackNo: startTrack + index })
    })
  }

  $('#saveBatchSetlist').on('click', async function() {
    if (!batchTable || !batchStreamData) {
      alert('表格未建立或資料遺失')
      return
    }

    const rows = batchTable.getData()
    const segment = parseInt($('#batchSegment').val()) || 1

    // Validate: check for empty songID
    const errors = []
    rows.forEach((row, index) => {
      if (!row.songID) {
        errors.push(`第 ${index + 1} 行：歌曲未選擇`)
      }
    })

    if (errors.length > 0) {
      alert('請修正以下錯誤：\n' + errors.join('\n'))
      return
    }

    // Disable button and show loading state
    const $saveBtn = $(this)
    const originalText = $saveBtn.html()
    $saveBtn.prop('disabled', true).html('⏳ 儲存中...')

    try {
      // Prepare batch data (songID already stored in rows)
      const batchData = rows.map(row => ({
        streamID: batchStreamData.streamID,
        trackNo: row.trackNo,
        segmentNo: segment,
        songID: row.songID,
        note: row.note || null
      }))

      // Send batch POST request with user source header (to enable overwrite mode)
      const result = await apiRequest('POST', API_CONFIG.ENDPOINTS.setlist, batchData, {
        headers: { 'X-Source': 'user' }
      })

      alert(`成功儲存 ${rows.length} 筆歌單資料！`)
      batchEditModal.hide()

      // Reload setlist table if on setlist page
      if (getProcess() === 'setlist') {
        jsonTable.setData(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.setlist)
      }
    } catch (error) {
      console.error('Batch save failed:', error)
      alert('儲存失敗：' + error.message)
    } finally {
      // Re-enable button and restore text
      $saveBtn.prop('disabled', false).html(originalText)
    }
  })

  //--- Quick Add Event Handlers ---
  $('#quickStartBtn').on('click', async function() {
    // 清空並隱藏錯誤訊息
    $('#quickAddErrorMsg').html('')
    $('#quickAddError').hide()

    const startTrack = parseInt($('#quickStartTrack').val())
    if (!startTrack || startTrack < 1) {
      $('#quickAddErrorMsg').html('請填寫起始 Track 編號<br><small>Track 編號必須為大於 0 的整數</small>')
      $('#quickAddError').show()
      $('#quickAddError')[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      $('#quickStartTrack').focus()
      return
    }

    quickCurrentTrack = startTrack
    $('#quickNextTrack').text(quickCurrentTrack)

    // 顯示載入狀態
    const $btn = $(this)
    const originalText = $btn.html()
    $btn.prop('disabled', true).html('⏳ 載入中...')

    // Initialize Select2 for song selection
    try {
      const songlist = await apiRequest('GET', API_CONFIG.ENDPOINTS.songlist)
      const songOptions = songlist.map(s => ({
        id: s.songID,
        text: `${s.songName} - ${s.artist}`
      })).sort((a, b) => a.text.localeCompare(b.text))

      $('#quickSongSelect').select2({
        data: songOptions,
        width: '100%',
        dropdownParent: $('#modalQuickAdd'),
        placeholder: t('搜尋歌曲...', 'Search song...', '曲を検索...'),
        allowClear: true
      })

      quickSongSelect2 = $('#quickSongSelect').data('select2')

      // 恢復按鈕狀態
      $btn.prop('disabled', false).html(originalText)
    } catch (error) {
      console.error('Failed to load songlist:', error)

      // 恢復按鈕狀態
      $btn.prop('disabled', false).html(originalText)

      // 處理特定錯誤並顯示在 Modal 內
      const errorMsg = error.message || String(error)
      let errorDetail = ''

      if (errorMsg.includes('timeout') || errorMsg.includes('NetworkError') || errorMsg.includes('Failed to fetch')) {
        errorDetail = `無法連線到 Hyperdrive 服務<br><small>請檢查網路連線或確認 Hyperdrive 服務是否啟動（<code>http://localhost:8785</code>）</small>`
      } else if (errorMsg.includes('400') || errorMsg.includes('VALIDATION')) {
        errorDetail = `資料格式錯誤<br><small>請檢查 StreamID 是否有效</small>`
      } else {
        errorDetail = `${errorMsg}<br><small>請聯繫管理員或稍後再試</small>`
      }

      // 在 Modal 內顯示錯誤訊息
      $('#quickAddErrorMsg').html(errorDetail)
      $('#quickAddError').show()

      // 自動捲動到錯誤訊息
      $('#quickAddError')[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' })

      return
    }

    // Switch UI
    $('#quickStartSection').hide()
    $('#quickAddFormSection').show()

    // Focus on song select
    setTimeout(() => $('#quickSongSelect').select2('open'), 100)
  })

  $('#quickAddSongBtn').on('click', quickAddSong)

  // Enter key to add song
  $('#quickNote').on('keypress', function(e) {
    if (e.which === 13) {
      e.preventDefault()
      quickAddSong()
    }
  })

  // Esc key handling for Quick Add modal is disabled
  // Reason: Conflicts with HTML setting data-bs-keyboard="false"
  // The modal should NOT close on Esc to prevent accidental data loss during continuous adding
  // User must explicitly click X button to close
  // TODO: Remove this commented code after confirming no side effects (tested 2025-10-26)
  /*
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && quickAddModal._isShown) {
      quickAddModal.hide()
    }
  })
  */

  async function quickAddSong() {
    // 清空並隱藏錯誤訊息
    $('#quickAddErrorMsg').html('')
    $('#quickAddError').hide()

    const songID = $('#quickSongSelect').val()
    const note = $('#quickNote').val()
    const segment = parseInt($('#quickSegment').val()) || 1

    if (!songID) {
      $('#quickAddErrorMsg').html(t(
        '請選擇歌曲<br><small>從下拉選單選擇歌曲，或點擊「新增初回歌曲」按鈕</small>',
        'Please select a song<br><small>Select from dropdown, or click "Add New Song"</small>',
        '曲を選択してください<br><small>ドロップダウンから選択、または「新規楽曲追加」をクリック</small>'
      ))
      $('#quickAddError').show()
      $('#quickAddError')[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      setTimeout(() => $('#quickSongSelect').select2('open'), 300)
      return
    }

    try {
      // POST to API immediately with user source header
      await apiRequest('POST', API_CONFIG.ENDPOINTS.setlist, {
        streamID: quickStreamData.streamID,
        trackNo: quickCurrentTrack,
        segmentNo: segment,
        songID: parseInt(songID),
        note: note || null
      }, {
        headers: { 'X-Source': 'user' }
      })

      // Get song name for display
      const selectedData = $('#quickSongSelect').select2('data')[0]
      const songDisplay = selectedData ? selectedData.text : `Song ID: ${songID}`

      // Add to list
      const listItem = $(`
        <div class="border-bottom pb-1 mb-1">
          <small>
            <strong>Track ${quickCurrentTrack}:</strong> ${songDisplay}
            ${note ? `<span class="text-muted">(${note})</span>` : ''}
          </small>
        </div>
      `)

      if ($('#quickAddedList').find('.text-muted').length > 0) {
        $('#quickAddedList').empty()
      }
      $('#quickAddedList').append(listItem)

      // Auto-scroll to bottom
      $('#quickAddedList').scrollTop($('#quickAddedList')[0].scrollHeight)

      // Increment track
      quickCurrentTrack++
      $('#quickNextTrack').text(quickCurrentTrack)

      // Clear form
      $('#quickSongSelect').val('').trigger('change')
      $('#quickNote').val('')

      // Focus back to song select
      setTimeout(() => $('#quickSongSelect').select2('open'), 100)

      console.log(`Quick added: Track ${quickCurrentTrack - 1}`)

    } catch (error) {
      console.error('Quick add failed:', error)

      // 處理特定錯誤並顯示在 Modal 內
      const errorMsg = error.message || String(error)
      let errorDetail = ''

      if (errorMsg.includes('already exists') || errorMsg.includes('Conflict')) {
        errorDetail = `此歌曲已存在於此 Track<br><small>Track <strong>${quickCurrentTrack}</strong> 已有歌曲，系統已執行更新</small>`
      } else if (errorMsg.includes('timeout') || errorMsg.includes('NetworkError') || errorMsg.includes('Failed to fetch')) {
        errorDetail = `無法連線到 Hyperdrive 服務<br><small>請檢查網路連線或確認 Hyperdrive 服務是否啟動（<code>http://localhost:8785</code>）</small>`
      } else if (errorMsg.includes('400') || errorMsg.includes('VALIDATION') || errorMsg.includes('Required fields missing')) {
        errorDetail = `資料格式錯誤<br><small>請確認所有必填欄位已填寫（StreamID, Track, Segment, SongID）</small>`
      } else if (errorMsg.includes('Foreign key constraint')) {
        errorDetail = `資料庫錯誤<br><small>StreamID 或 SongID 不存在於資料庫中</small>`
      } else {
        errorDetail = `${errorMsg}<br><small>請聯繫管理員或稍後再試</small>`
      }

      // 在 Modal 內顯示錯誤訊息
      $('#quickAddErrorMsg').html(errorDetail)
      $('#quickAddError').show()

      // 自動捲動到錯誤訊息
      $('#quickAddError')[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  // Add new song button in batch editor
  $('#batchAddNewSong').on('click', function() {
    // Close batch editor temporarily
    batchEditModal.hide()

    // Reset and prepare add song modal
    $('#modalAddSong form')[0].reset()
    if ($('#artistName').hasClass('select2-hidden-accessible')) {
      $('#artistName').select2('destroy')
    }
    initializeArtistSelect()

    // Open add song modal
    const addSongModal = new bootstrap.Modal(document.getElementById('modalAddSong'))
    addSongModal.show()

    // When song is added, reload batch editor
    $('#modalAddSong').one('hidden.bs.modal', function() {
      // Reopen batch editor
      batchEditModal.show()

      // Refresh the table to get new songlist data
      if (batchTable) {
        // Trigger a refresh - user can re-generate table if needed
        console.log('Song added, regenerate table to see new song')
      }
    })
  })

  // Add new song button in quick add
  $('#quickAddNewSong').on('click', function() {
    // Close quick add temporarily
    quickAddModal.hide()

    // Reset and prepare add song modal
    $('#modalAddSong form')[0].reset()
    if ($('#artistName').hasClass('select2-hidden-accessible')) {
      $('#artistName').select2('destroy')
    }
    initializeArtistSelect()

    // Open add song modal
    const addSongModal = new bootstrap.Modal(document.getElementById('modalAddSong'))
    addSongModal.show()

    // When song is added, reload quick add and refresh Select2
    $('#modalAddSong').one('hidden.bs.modal', async function() {
      // Reopen quick add
      quickAddModal.show()

      // Reload Select2 options with new song
      try {
        const songlist = await apiRequest('GET', API_CONFIG.ENDPOINTS.songlist)
        const songOptions = songlist.map(s => ({
          id: s.songID,
          text: `${s.songName} - ${s.artist}`
        })).sort((a, b) => a.text.localeCompare(b.text))

        // Clear and reload Select2
        $('#quickSongSelect').empty().select2('destroy')
        $('#quickSongSelect').select2({
          data: songOptions,
          width: '100%',
          dropdownParent: $('#modalQuickAdd'),
          placeholder: t('搜尋歌曲...', 'Search song...', '曲を検索...'),
          allowClear: true
        })

        // Auto-select the newly added song (last one in the list)
        const lastSong = songlist[songlist.length - 1]
        if (lastSong) {
          $('#quickSongSelect').val(lastSong.songID).trigger('change')
          console.log(`Auto-selected newly added song: ${lastSong.songName}`)
        }

        // Focus on song select
        setTimeout(() => $('#quickSongSelect').select2('open'), 100)

      } catch (error) {
        console.error('Failed to reload songlist:', error)
        alert('重新載入歌曲清單失敗')
      }
    })
  })

  // Add new song button in setlist table (use event delegation for dynamic element)
  $('#content').on('click', '#addNewSongInSetlist', function() {
    // Reset and prepare add song modal
    $('#modalAddSong form')[0].reset()
    if ($('#artistName').hasClass('select2-hidden-accessible')) {
      $('#artistName').select2('destroy')
    }
    initializeArtistSelect()

    // Show modal
    const addSongModal = new bootstrap.Modal($('#modalAddSong')[0])
    addSongModal.show()

    // Handle modal close - reload setlist to get updated songlist
    $('#modalAddSong').one('hidden.bs.modal', function() {
      // Check if we're still on setlist page
      if (getProcess() === 'setlist') {
        console.log('Song may have been added, reloading setlist table')
        // Reload table to refresh songlist data in Select2
        jsonTable.setData(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.setlist)
      }
    })
  })

// Get github latest commit
function getGitCommitMsg(){
  return new Promise((resolve, reject)=>{
    $.ajax({
      url:'https://api.github.com/repos/maisakiberryfan/website/commits?per_page=1',
    })
    .done((d)=>{
      let html = `
      <div>
        <h6>Latest Commit</h6>
        <p class="small mb-1">${dayjs(d[0].commit.committer.date).format('YYYY/MM/DD HH:mmZ')}</p>
        <p class="small">${marked.parse(d[0].commit.message)}</p>
      </div>
      `
      resolve(html)
    })
    .fail((err)=>{reject(err)});
  })
}

})//end ready
