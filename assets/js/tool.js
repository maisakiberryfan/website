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
let nav = `
<nav class="navbar fixed-top navbar-expand-lg bg-body-tertiary px-5">
  <div class="container-fluid">
    <a class="navbar-brand" href='/' target='_self'>苺咲べりぃ非公式倉庫</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarContent">
      <ul class="navbar-nav">
		<li class="nav-item dropdown">
          <button class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Berry's
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item setContent" href='/profile' data-ext='.htm'>Profile</a></li>
            <li><a class="dropdown-item setContent" href='/history' data-ext='.md'>History</a></li>
            <li><a class="dropdown-item setContent" href='/clothes' data-ext='.htm'>Clothes</a></li>
          </ul>
        </li>
        <!--<li class="nav-item">
          <a class="nav-link dropdown-item setContent" href='/history' data-ext='.md'>History</a>
        </li>-->
        <li class="nav-item dropdown">
          <button class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            List&nbsp;&nbsp;&nbsp;
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item setContent" href='/songlist' data-ext=''>Song List</a></li>
            <li><a class="dropdown-item setContent" href='/streamlist' data-ext='.json'>Stream List</a></li>
            <li><a class="dropdown-item setContent" href='/setlist' data-ext='.json'>Set List</a></li>
          </ul>
        </li>
        <li class="nav-item dropdown">
          <button class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Other wiki
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="https://seesaawiki.jp/maisakiberry/">seesaawiki</a></li>
            <li><a class="dropdown-item" href="https://hackmd.io/@MaisakiBerry">HackMD</a></li>
            <li><a class="dropdown-item" href="https://virtualyoutuber.fandom.com/wiki/Maisaki_Berry">Fandom</a></li>
          </ul>
        </li>
        <li class="nav-item dropdown">
          <button class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span>Fan </span><svg class='w' xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 640 512"><path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/></svg>
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="https://discord.gg/sXdaXB7">中文</a></li>
            <li><a class="dropdown-item" href="https://discord.gg/csQ77FEyTA">English</a></li>
          </ul>
        </li>
        <li class='nav-item py-2 py-lg-1 col-12 col-lg-auto'>
          <div class='vr d-none d-lg-flex h-100 mx-lg-2 text-white'></div>
        </li>
        <li class="nav-item">
          <a class="nav-link dropdown-item" href='https://github.com/maisakiberryfan/website'>
            <span><svg class='w' xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg></span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link dropdown-item" href='fileUpload.html'>fileUpload</a>
        </li>
        <li class="nav-item">
          <a class="nav-link dropdown-item setContent" href='/howTo' data-ext='.md'>How To Edit</a>
        </li>
      </ul>

      <!--右邊放官方連結-->
      <ui class="navbar-nav flex-row flex-wrap ms-md-auto">
        <li class="nav-item">
          <a class="nav-link px-2" href="https://www.maisakiberry.com/">
            <span>公式&emsp;</span><svg class='w' xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 576 512"><style>.w{fill:#fff}</style><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link px-2" href="https://twitter.com/MaisakiBerry">
            <svg class='b' xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 512 512"><style>.b{fill:#1DA1F2}</style><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link px-2" href="https://www.youtube.com/channel/UC7A7bGRVdIwo93nqnA3x-OQ">
            <svg class='r' xmlns="http://www.w3.org/2000/svg" height="1.25em" viewBox="0 0 576 512"><style>.r{fill:#ff0000}</style><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
          </a>
        </li>
      </ui>
    </div>
  </div>
</nav>
`

$(()=>{
  
  // Set marked options
  marked.use()

  //message modal 
  var msgModal = new bootstrap.Modal(document.getElementById('modal'))

  $('#nav').html(nav)

  $('.setContent').click((e)=>{
    e.preventDefault()
    setContent(e.target.pathname, true)
  })

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
        }

      if(clk){
        //by clicking navbar->write to history
        history.pushState({}, '', path)
      }
    }

    // Set page title
    document.title = title + '苺咲べりぃ非公式倉庫'

    // For API endpoints (setlist, streamlist, songlist), skip $.ajax() and directly call configJsonTable
    // This eliminates duplicate requests (previously $.ajax() + Tabulator's ajaxURL)
    if(process=='setlist' || process=='streamlist' || process=='songlist'){
      let c = `
            <button id='reloadBtn' class='btn btn-outline-light' data-disable-on-loading="true">
              <span class="loading-indicator spinner-border spinner-border-sm me-2" style="display: none;"></span>
              Reload Data
            </button>
            <button id='edit' class='btn btn-outline-light' data-bs-toggle="button">Edit mode</button>
            <button id='`+ (process=='streamlist'?'addStreamRow':'addRow') + `' class='btn btn-outline-light addRow' disabled>Add Row</button>`
            + (process=='streamlist'?`<button id='addFromList' class='btn btn-outline-light addRow' disabled>Add from list(Beta)</button>`:'') +
            `<button id='deleteRow' class='btn btn-outline-light'>Delete Row</button>
            <button id='dlcsv' class='btn btn-outline-light'>Get CSV</button>
            <button id='dljson' class='btn btn-outline-light'>Get JSON</button>`
            + (process=='setlist'?`
            <div class="my-2">
              <button id='addNewSongInSetlist' class='btn btn-success' style="display: none;">
                ➕ 新增初回歌曲 (Add New Song)
              </button>
            </div>`:'') +
            `<div id='setTableMsg' class='p-3'>&emsp;</div>
            <div id='tb' class='table-dark table-striped table-bordered'>progressing...</div>
              `
      $("#content").empty().append(c)
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
          placeholder: 'Select song...',
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

        // Initialize Select2
        $editor.select2({
          data: dataOptions,
          width: '100%',
          dropdownAutoWidth: true,
          placeholder: 'Select song...',
          allowClear: true,
          dropdownParent: $('body'),  // Avoid z-index issues
        })

        // Set current value from songID
        const currentSongID = cell.getRow().getData().songID
        if (currentSongID) {
          $editor.val(currentSongID).trigger('change.select2')
        }

        // Handle selection change
        $editor.on('select2:select select2:clear', async function(e) {
          if (hasSucceeded) return

          const selectedId = $editor.val()
          const selectedData = $editor.select2('data')[0]

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

            await apiRequest('PUT', `${endpoint}/${id}`, updateData)

            // Show success indicator
            cell.getElement().style.backgroundColor = '#d4edda'
            setTimeout(() => {
              cell.getElement().style.backgroundColor = ''
            }, 1000)

            console.log(`Song updated: ${selectedData ? selectedData.songName : '(cleared)'} (songID: ${selectedId || null})`)
          } catch (error) {
            console.error('Error syncing song selection:', error)
            alert(`儲存失敗：${error.message}`)
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
            cancel()
          }
        })

        // Auto-open dropdown after initialization
        setTimeout(() => $editor.select2('open'), 50)

      } catch (error) {
        console.error('Failed to load songlist:', error)
        alert('載入歌曲清單失敗：' + error.message)
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
          ✅ 已載入現有歌單資料（${existingEntries.length} 首）<br>
          <small>可直接編輯或點擊「產生表格」重新建立</small>
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
          📋 此直播尚無歌單資料<br>
          <small>請設定參數後點擊「產生表格」開始建立</small>
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
    $('#quickAddedList').html('<small class="text-muted">尚未新增任何歌曲</small>')

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
    $('#quickSongSelect').empty().html('<option value="">搜尋歌曲...</option>')

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

  //column definition
  var setlistColDef = [
    {title:"streamID", field:"streamID", visible: false, download:true},
    {title:`local time(${dayjs().format('Z')})`, field:"time", mutator: (cell) => dayjs(cell).format('YYYY/MM/DD HH:mm'), accessor: (value) => dayjs(value).toISOString(), width:'150', formatter:dateWithYTLink},
    {title:"Seg", field:"segmentNo", sorter:'number', width:60},
    {title:"Track", field:"trackNo", sorter:'number', width:80},
    {
      title:"Song",
      field:"songName",
      editor: setlistSongSelect2Editor,
      editable: false,
      width: 300,
      topCalc:'count',
      topCalcFormatter:(c=>'subtotal/小計：'+c.getValue()),
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
        return `
          <div style="line-height: 1.5;">
            <div style="font-weight: 500;">${ja}</div>
            ${en ? `<div style="font-size: 0.85em; color: #999; margin-top: 2px;">${en}</div>` : ''}
          </div>
        `;
      }
    },
    {
      title:"Artist",
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
        return `
          <div style="line-height: 1.5;">
            <div>${ja}</div>
            ${en ? `<div style="font-size: 0.85em; color: #999; margin-top: 2px;">${en}</div>` : ''}
          </div>
        `;
      }
    },
    {
      title:"Note",
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
    {title:"artistEn", field:"artistEn", visible: false, download:true},  // Hidden field for English artist
  ]

  var streamlistColDef = [
    {title:"thumbnail", formatter:imageLink, headerFilter:false},
    {title:"streamID", field:"streamID", visible: false, download:true},
    {
      title:"title",
      field:"title",
      width:300,
      topCalc:'count',
      topCalcFormatter:(c=>'subtotal/小計：'+c.getValue()),
      formatter:multiLineLinkFormat,
      headerFilter:"input",
      headerFilterPlaceholder:"搜尋標題或影片 ID",
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
    {title:`local time(${dayjs().format('Z')})`, field:"time", mutator: (cell) => dayjs(cell).format('YYYY/MM/DD HH:mm'), accessor: (value) => dayjs(value).toISOString()},
    {title:"categories", field:"categories",
      headerFilter:select2,
      headerFilterParams:{field:'categories', multiple: true},
      headerFilterFunc: function(headerValue, rowValue, rowData, filterParams) {
        // No filter applied
        if (!headerValue || headerValue.length === 0) return true;

        // Ensure rowValue is an array
        if (!Array.isArray(rowValue)) return false;

        // Check if any selected filter value matches any category in the row (OR logic)
        return headerValue.some(filterVal =>
          rowValue.some(rowCat =>
            rowCat.toLowerCase().includes(filterVal.toLowerCase())
          )
        );
      },
      headerSort:false,
      editor:select2,
      editorParams:{field:'categories', multiple: true},
      formatter:(cell=>{
        const categories = cell.getValue();
        if (!Array.isArray(categories)) return '';

        // Display categories with line breaks for better readability
        return categories.map(cat => cat).join('<br>');
      })
    },
    {title:"note", field:"note"},
  ]

  // Tabulator 自動完成設定常數
  const AUTOCOMPLETE_PARAMS = {
    valuesLookup: "active",
    autocomplete: true
  }

  // Bilingual version (Japanese + English in one view)
  var songlistColDef = [
    {title:"songID", field:"songID", visible: false, download:true},
    {
      title:"Song Name / 歌名",
      field:"songName",
      width:300,
      topCalc:'count',
      topCalcFormatter:(c=>'subtotal/小計：'+c.getValue()),
      headerFilter:"input",
      headerFilterPlaceholder:"搜尋日文或英文歌名",
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
        return `
          <div style="line-height: 1.5;">
            <div style="font-weight: 500;">${ja}</div>
            ${en ? `<div style="font-size: 0.85em; color: #999; margin-top: 2px;">${en}</div>` : ''}
          </div>
        `;
      }
    },
    {
      title:"Artist / 歌手",
      field:"artist",
      width:250,
      headerFilter:"input",
      headerFilterPlaceholder:"搜尋日文或英文歌手",
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
        return `
          <div style="line-height: 1.5;">
            <div>${ja}</div>
            ${en ? `<div style="font-size: 0.85em; color: #999; margin-top: 2px;">${en}</div>` : ''}
          </div>
        `;
      }
    },
    {title:"Genre", field:"genre", headerFilter:"input"},
    {title:"Tie-up", field:"tieup", headerFilter:"input"},
    {title:"Note", field:"songNote", headerFilter:"input"},
  ]

  // Initialize content after all colDef are defined
  // (Must be after Line 1047 to ensure setlistColDef, streamlistColDef, songlistColDef are initialized)
  //if direct url
  setContent(location.pathname)

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
      placeholder: 'Select or type artist name...',
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

    // Set field label
    $('#bilingualFieldLabel').text(fieldLabel)

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
          jsonTable.redrawRows([row])

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
      colDef=setlistColDef
    }
    if(p == 'streamlist'){
      colDef=streamlistColDef
    }
    if(p == 'songlist'){
      colDef=songlistColDef
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
      // Remove songName editor in setlist to allow row selection
      if (p === 'setlist' && col.field === 'songName' && col.editor) {
        const { editor, ...rest } = newCol
        return rest
      }
      return newCol
    })

    jsonTable = new Tabulator("#tb", {
      ajaxURL: u,
      ajaxResponse: function(url, params, response) {
        return response.data || response; // 解包 {data: [...]} 格式
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
    })

    // Listen for data processing events - data is ready for access via getData()
    jsonTable.on("dataProcessed", function(){
      const data = jsonTable.getData();
      // Store reference to processed data for getDynamicFieldData
      window.tableDataLoaded = true;

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
            label: '📝 補檔用 - 批次編輯歌單',
            action: () => openBatchEditor(data)
          },
          {
            label: '⚡ 直播用 - 快速新增歌單',
            action: () => openQuickAdd(data)
          },
          { type: 'divider' },
          {
            label: '📋 複製網址',
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
            label: '🎥 查看 YouTube 影片',
            action: () => window.open(`https://youtube.com/watch?v=${data.streamID}`, '_blank')
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
          finalValue = dayjs(value, 'YYYY/MM/DD HH:mm').toISOString()
          console.log(`Time field converted: ${value} (local) → ${finalValue} (UTC)`)
        }

        // PUT update to API
        const updateData = { [apiField]: finalValue }
        await apiRequest('PUT', `${endpoint}/${id}`, updateData)

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
      $('#setTableMsg').text('資料已從表格移除').addClass('text-bg-info')
      setTimeout(() => {
        $('#setTableMsg').html('&emsp;').removeClass('text-bg-info')
      }, 2000)
    })
  }

  //--- jsonTable button block ---

  $('#content').on('click', '#reloadBtn', ()=>{
    jsonTable.setData()
    jsonTable.clearFilter(true)
    jsonTable.deselectRow()
  })

  $('#content').on('click', '#edit', ()=>{
    $('.addRow').prop('disabled', !canEdit())
    $('#deleteRow').prop('disabled', canEdit())

    if(canEdit()){
      // 進入編輯模式：動態添加 editor
      const editableColDef = colDef.map(col => {
        // Songlist: Use bilingual editor for songName and artist
        if (getProcess() === 'songlist') {
          if (col.field === 'songName') {
            return {
              ...col,
              editor: bilingualEditor,
              editorParams: { field: 'songName', fieldLabel: 'Song Name / 歌名' },
              editable: true
            }
          }
          if (col.field === 'artist') {
            return {
              ...col,
              editor: bilingualEditor,
              editorParams: { field: 'artist', fieldLabel: 'Artist / 歌手' },
              editable: true
            }
          }
        }

        // Setlist: Song 欄位已有 Select2 editor，直接啟用
        if (col.field === 'songName' && col.editor) {
          return { ...col, editable: true }
        }
        // Artist 欄位在 setlist 保持唯讀（由 Select2 自動填入）
        // 在 streamlist 添加 editor（允許手動編輯）
        if (col.field === 'artist') {
          if (getProcess() === 'setlist') {
            return col  // No editor in setlist, auto-updated by song selection
          }
          // For streamlist, fall through to add default editor
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

      $('#setTableMsg').text('You can edit data by clicing cell , or using Excel edit , click the table, and paste to it.').addClass('text-bg-info')
    }
    else{
      // 離開編輯模式：恢復原始欄位定義（移除特定 editor 避免攔截點擊）
      const viewColDef = colDef.map(col => {
        const newCol = { ...col, editable: false }
        // 移除 songName 的 editor 以允許正常的 row selection
        if (col.field === 'songName' && col.editor) {
          const { editor, ...rest } = newCol
          return rest
        }
        return newCol
      })
      jsonTable.setColumns(viewColDef)

      // Hide add new song button
      $('#addNewSongInSetlist').hide()
      //tell user upload to github
      $('#setTableMsg').text('Please upload the JSON to github.Thanks.').addClass('text-bg-info')
      $('#dljson').click()
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
      }

      // Close modal and reset form
      addSongModal.hide()
      $('#modalAddSong form')[0].reset()

      // Show success message only if on songlist page
      if (currentPath === 'songlist') {
        $('#setTableMsg').text('Song added successfully').addClass('text-bg-success')
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
      placeholder: categoryData.length === 0 ? 'Type to add categories...' : 'Select or type categories...'
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

  // Add from list button click handler
  $('#content').on('click', '#addFromList', () => {
    addFromLatestList()
  })

  // Add from latest list function for streamlist
  function addFromLatestList() {
    $.ajax({
      url: 'https://getytvideoinfo.katani.workers.dev/newvideos'
    })
    .done((data) => {
      if (!data.items || data.items.length === 0) {
        $('#setTableMsg').text('No new data available').addClass('text-bg-warning')
        setTimeout(() => {
          $('#setTableMsg').html('&emsp;').removeClass('text-bg-warning')
        }, 3000)
        return
      }

      // Get existing IDs from current table data
      const existingIds = jsonTable.getData().map(row => row.id)
      
      // Filter out duplicates and convert format
      const newData = data.items
        .filter(item => !existingIds.includes(item.id))
        .map(item => ({
          id: item.id,
          title: item.snippet.title,
          time: item.time,
          category: item.category || preCategory(item.snippet.title)
        }))
        .sort((a, b) => new Date(b.time) - new Date(a.time)) // Sort by date desc

      if (newData.length === 0) {
        $('#setTableMsg').text('No new videos found (all videos already exist)').addClass('text-bg-info')
        setTimeout(() => {
          $('#setTableMsg').html('&emsp;').removeClass('text-bg-info')
        }, 3000)
        return
      }

      // Add data to table at top
      jsonTable.addData(newData, true)
      
      $('#setTableMsg').text(`Successfully added ${newData.length} new video(s)`).addClass('text-bg-success')
      setTimeout(() => {
        $('#setTableMsg').html('&emsp;').removeClass('text-bg-success')
      }, 3000)
    })
    .fail((error) => {
      console.error('Error fetching latest videos:', error)
      $('#setTableMsg').text('Failed to fetch latest videos').addClass('text-bg-danger')
      setTimeout(() => {
        $('#setTableMsg').html('&emsp;').removeClass('text-bg-danger')
      }, 3000)
    })
  }



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
    const [ytLatest, gitCommitMsg] = await Promise.all([getYTlatest(), getGitCommitMsg()])
    return ytLatest + gitCommitMsg
  }
  catch (error) {
    console.error('Error fetching data:', error)
  }
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
        placeholder: '搜尋歌曲...',
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
      $('#quickAddErrorMsg').html('請選擇歌曲<br><small>從下拉選單選擇歌曲，或點擊「新增初回歌曲」按鈕</small>')
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
          placeholder: '搜尋歌曲...',
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

//get github latest commit
function getGitCommitMsg(){
  return new Promise((resolve, reject)=>{
    $.ajax({
      url:'https://api.github.com/repos/maisakiberryfan/website/commits?per_page=1',
    })
    .done((d)=>{
      let html = `
      <div class="container mt-3">
        <p>Last update：${dayjs(d[0].commit.committer.date).format('YYYY/MM/DD HH:mmZ')}</p>
        <p>Update content：${marked.parse(d[0].commit.message)}</p>
      </div>
      `
      resolve(html)
    })
    .fail((err)=>{reject(err)});
  })  
}

})//end ready
