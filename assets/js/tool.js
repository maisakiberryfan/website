//from cdn
import 'https://unpkg.com/jquery@3.7.1/dist/jquery.min.js'
import 'https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js'
import 'https://unpkg.com/bootstrap@5.3.3/dist/js/bootstrap.min.js'
import "https://cdnjs.cloudflare.com/ajax/libs/tabulator/6.3.1/js/tabulator.min.js"
import "https://unpkg.com/marked@12.0.1/marked.min.js"
import "https://unpkg.com/dayjs@1.11.10/dayjs.min.js"
import "https://unpkg.com/dayjs@1.11.10/plugin/utc.js"
import "https://unpkg.com/select2@4.0.13/dist/js/select2.full.min.js"
import "https://unpkg.com/video.js@8.21.1/dist/video.min.js"

// API configuration
import { API_CONFIG, apiRequest, loadingManager, showError } from '../../config.js'

// 載入 dayjs UTC 插件
dayjs.extend(window.dayjs_plugin_utc)

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
      url = path.slice(1)

      //find title
      let t = $("#navbarContent a[href='"+path+"']")
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
      
    //load content
    $.ajax({
    url:url,
    //cache:false
    }).done((d, textStatus, request)=>{
      document.title = title + '苺咲べりぃ非公式倉庫'
      let ext = url.split('.')  //check .html
      //check if there are some exception page
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
              <button id='dljson' class='btn btn-outline-light'>Get JSON</button>
              <div id='setTableMsg' class='p-3'>&emsp;</div>`
              + (process=='songlist'?`
              <div class="mb-3 p-2 border rounded bg-dark-subtle">
                <div class="form-check form-switch d-inline-block">
                  <input class="form-check-input" type="checkbox" role="switch" id="languageSwitch">
                  <label class="form-check-label text-light" for="languageSwitch">
                    <span id="langJA">日文</span> / <span id="langEN" class="text-muted">English</span>
                  </label>
                </div>
              </div>`:'') +
              `<div id='tb' class='table-dark table-striped table-bordered'>progressing...</div>
                `
        $("#content").empty().append(c)

        configJsonTable(url, process)
      }
      else if(ext[1] == 'htm'){
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
  function getDynamicFieldData(table, field) {
    try {
      // Check if data is processed and ready
      if (!window.tableDataLoaded) {
        return [];
      }

      const tableData = table ? table.getData() : (window.jsonTable ? window.jsonTable.getData() : []);
      const uniqueValues = new Set();

      if (tableData.length === 0) {
        return [];
      }

      tableData.forEach(row => {
        const fieldValue = row[field];

        if (Array.isArray(fieldValue)) {
          // Handle array fields (like categories)
          fieldValue.forEach(val => {
            if (val && typeof val === 'string' && val.trim().length > 0) {
              uniqueValues.add(val.trim());
            }
          });
        } else if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
          // Handle string fields (like songName, artist, note)
          const strValue = String(fieldValue).trim();
          if (strValue.length > 0) {
            uniqueValues.add(strValue);
          }
        }
      });

      const result = Array.from(uniqueValues).sort().map(val => ({id: val, text: val}));
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
          artist: s.artist
        })).sort((a, b) => a.text.localeCompare(b.text))

        op.select2({
          data: dataOptions,
          width: '100%',
          dropdownAutoWidth: true,
          placeholder: 'Select song...',
          allowClear: true,
          multiple: false,
          dropdownParent: $('#modalBatchEdit'),
          templateResult: function(data) {
            if (!data.id) return data.text
            return data.text
          },
          templateSelection: function(data) {
            return data.text
          }
        })

        // Set current value (songID)
        const val = cell.getValue()
        op.val(val).trigger('change')

        op.on('change', function(){
          const selectedId = op.val()
          const selectedData = op.select2('data')[0]

          // Update row data with songID and display info
          const rowData = cell.getRow().getData()
          rowData.songID = selectedId
          if (selectedData && selectedData.songName) {
            rowData.songDisplay = selectedData.text
            rowData.songName = selectedData.songName
            rowData.artist = selectedData.artist
          }

          success(selectedId)
        })

        op.on('select2:close', function(){
          success(op.val())
        })

      } catch (error) {
        console.error('Failed to load select2 data:', error)
        success(cell.getValue())
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
    try {
      const allSetlist = await apiRequest('GET', API_CONFIG.ENDPOINTS.setlist)
      const existingEntries = allSetlist.filter(entry => entry.streamID === streamData.streamID)
                                        .sort((a, b) => a.track - b.track)

      if (existingEntries.length > 0) {
        // Found existing data - auto-populate
        const firstEntry = existingEntries[0]
        const lastEntry = existingEntries[existingEntries.length - 1]

        $('#batchStartTrack').val(firstEntry.track)
        $('#batchTotalSongs').val(existingEntries.length)
        $('#batchSegment').val(firstEntry.segment || 1)

        // Show status message
        $('#batchLoadStatus').html(`
          ✅ 已載入現有歌單資料（${existingEntries.length} 首）<br>
          <small>可直接編輯或點擊「產生表格」重新建立</small>
        `).removeClass('alert-warning').addClass('alert-success').show()

        // Auto-generate table with existing data
        setTimeout(() => {
          loadExistingSetlist(existingEntries)
        }, 100)

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
      // Map entries to table rows
      const rows = entries.map(entry => {
        const song = songlist.find(s => s.songID === entry.songID)
        return {
          track: entry.track,
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
        maxHeight: "100%",
        columns: [
          {title: "Track", field: "track", width: 80, editor: false},
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
      batchTable.on("rowMoved", function() {
        recalculateTrackNumbers()
      })

      // Update track numbers when start track changes
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

    // Set stream info
    $('#quickStreamID').text(streamData.streamID)
    $('#quickStreamTitle').text(streamData.title)

    // Reset form
    $('#quickStartTrack').val('')
    $('#quickSegment').val(1)
    $('#quickNote').val('')
    $('#quickAddedList').html('<small class="text-muted">尚未新增任何歌曲</small>')

    // Reset state
    quickCurrentTrack = null
    $('#quickAddFormSection').hide()
    $('#quickStartSection').show()

    // Initialize Select2 for song selection
    if (quickSongSelect2) {
      quickSongSelect2.destroy()
    }

    // Try to auto-detect next track from existing setlist
    try {
      const allSetlist = await apiRequest('GET', API_CONFIG.ENDPOINTS.setlist)
      const existingEntries = allSetlist.filter(entry => entry.streamID === streamData.streamID)

      if (existingEntries.length > 0) {
        const maxTrack = Math.max(...existingEntries.map(e => e.track))
        const firstSegment = existingEntries[0].segment || 1
        $('#quickStartTrack').val(maxTrack + 1)
        $('#quickSegment').val(firstSegment)
        console.log(`Auto-detected next track: ${maxTrack + 1}`)
      }
    } catch (error) {
      console.error('Failed to auto-detect track:', error)
    }

    quickAddModal.show()

    // Focus on start track input
    setTimeout(() => $('#quickStartTrack').focus(), 300)
  }

//--- json table ---
  //use a global variable to easy access the table and colDef
  var jsonTable, colDef

  //column definition
  var setlistColDef = [
    {title:"streamID", field:"streamID", visible: false, download:true},
    {title:`local time(${dayjs().format('Z')})`, field:"time", mutator:((cell)=>dayjs(cell).format('YYYY/MM/DD HH:mm')), accessor:((value)=>dayjs(value).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')), width:'150', formatter:dateWithYTLink},
    {title:"Seg", field:"segment", sorter:'number', width:60},
    {title:"Track", field:"track", sorter:'number', width:80},
    {title:"Song", field:"songName", topCalc:'count', topCalcFormatter:(c=>'subtotal/小計：'+c.getValue()), headerFilter:select2, headerFilterParams:{field:"songName"}, headerSort:false},
    {title:"Artist", field:"artist", headerFilter:select2, headerFilterParams:{field:"artist"}, headerSort:false},
    {title:"Note", field:"note", headerFilter:select2, headerFilterParams:{field:"note"}, headerSort:false},
    {title:"YTLink", field:"YTLink", visible: false, download:true},
    {title:"songID", field:"songID", visible: false, download:true},
  ]

  var streamlistColDef = [
    {title:"thumbnail", formatter:imageLink, headerFilter:false},
    {title:"streamID", field:"streamID", visible: false, download:true},
    {title:"title", field:"title", width:300, topCalc:'count',topCalcFormatter:(c=>'subtotal/小計：'+c.getValue()), formatter:multiLineLinkFormat},
    {title:`local time(${dayjs().format('Z')})`, field:"time", mutator:((cell)=>dayjs(cell).format('YYYY/MM/DD HH:mm')), accessor:((value)=>dayjs(value).utc().format('YYYY-MM-DDTHH:mm:ss[Z]'))},
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

  // Japanese version (default)
  var songlistColDef_JA = [
    {title:"songID", field:"songID", visible: false, download:true},
    {title:"Song Name", field:"songName", width:250, topCalc:'count', topCalcFormatter:(c=>'subtotal/小計：'+c.getValue()), editor:"input", headerFilter:"list", headerFilterParams:AUTOCOMPLETE_PARAMS},
    {title:"Artist", field:"artist", width:200, headerFilter:"input"},
    {title:"Genre", field:"genre", headerFilter:"input"},
    {title:"Tie-up", field:"tieup", headerFilter:"input"},
    {title:"Note", field:"songNote", headerFilter:"input"},
  ]

  // English version
  var songlistColDef_EN = [
    {title:"songID", field:"songID", visible: false, download:true},
    {title:"Song Name (EN)", field:"songNameEn", width:250, topCalc:'count', topCalcFormatter:(c=>'subtotal/小計：'+c.getValue()), headerFilter:"input"},
    {title:"Artist (EN)", field:"artistEn", width:200, headerFilter:"input"},
    {title:"Genre", field:"genre", headerFilter:"input"},
    {title:"Tie-up", field:"tieup", headerFilter:"input"},
    {title:"Note", field:"songNote", headerFilter:"input"},
  ]

  // Default to Japanese
  var songlistColDef = songlistColDef_JA

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
      },
      templateResult: function(item) {
        if (item.loading) {
          return item.text
        }

        // Create display for options
        var $container = $('<span>')
        $container.text(item.text || item.id)

        if (item.newTag) {
          $container.append(' <small>(new)</small>')
        }

        return $container
      },
      templateSelection: function(item) {
        return item.text || item.id
      }
    })


    // Add event handlers
    $('#artistName').on('select2:select', function(e) {
      const selectedData = e.params.data

      if (!selectedData.newTag && selectedData.artistEn) {
        // Existing artist with English name, auto-fill but keep editable
        $('#artistNameEn').val(selectedData.artistEn)
      }
      // For new artists or artists without English names, do nothing, let user fill manually
    })

    $('#artistName').on('select2:clear', function() {
      // When cleared, also clear artistEN field for consistency
      $('#artistNameEn').val('')
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

    onRendered(function(){
      // console.log('select2 onRendered called for field:', f, 'tableDataLoaded:', window.tableDataLoaded);
      let op = $(editor)

      // Get data dynamically from table for all fields
      var d = getDynamicFieldData(cell.getTable(), f)

      // Determine if this is a header filter or cell editor
      const isHeaderFilter = $(cell.getElement()).closest('.tabulator-header').length > 0

      op.select2({
            data: d,
            width: '300px',
            allowClear: true,
            placeholder: editorParams.multiple ? 'Select categories...' : '',
            tags: true,
            multiple: editorParams.multiple || false,
            dropdownParent: isHeaderFilter ? $('body') : $(cell.getElement()).closest('.tabulator'),
            templateResult: function(data) {
              if (!data.id) return data.text;
              return data.text;
            },
            templateSelection: function(data) {
              return data.text;
            },
            escapeMarkup: function(markup) {
              return markup; // Let our custom templates work
            }
      })

      // Set initial value
      let v = cell.getValue()
      if (v === null || v === undefined) {
        v = editorParams.multiple ? [] : ''
      }

      // Set the value and trigger change
      op.val(v).trigger('change')

      // Handle change events
      op.on('change.select2', function (e) {
        let val = $(this).val()
        // For multiple selection, ensure we return array format for category/categories
        if (editorParams.multiple && (f === 'category' || f === 'categories')) {
          val = Array.isArray(val) ? val : (val ? [val] : [])
        }
        success(val)
      })

      // Handle close events for immediate update
      op.on('select2:close', function (e) {
        let val = $(this).val()
        if (editorParams.multiple && (f === 'category' || f === 'categories')) {
          val = Array.isArray(val) ? val : (val ? [val] : [])
        }
        success(val)
      })

      // Don't auto-open select2 - let user click to open
      // Focus is handled by Tabulator when cell is clicked
    })

    //add editor to cell
    return editor
  }


  //set table
  function configJsonTable(u, p){

    if(p == 'setlist'){
      colDef=setlistColDef
    }
    if(p == 'streamlist'){
      colDef=streamlistColDef
    }
    if(p == 'songlist'){
      colDef=songlistColDef
    }

    jsonTable = new Tabulator("#tb", {
      ajaxURL: u,
      ajaxResponse: function(url, params, response) {
        return response.data || response; // 解包 {data: [...]} 格式
      },
      height:700,
      columnDefaults:{
        headerFilter:"input",
      },
      columns:colDef,
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
        e.preventDefault();

        const data = row.getData();
        const categories = data.categories || [];

        // Only show menu for singing streams
        const isSingingStream = categories.some(cat =>
          cat.includes('歌枠') || cat.includes('Singing') || cat.includes('singing') || cat.includes('karaoke')
        );

        if (isSingingStream) {
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
              label: '🎥 查看 YouTube 影片',
              action: () => window.open(`https://youtube.com/watch?v=${data.streamID}`, '_blank')
            }
          ]);
        }
      });
    }

    // Add API sync events for immediate save
    jsonTable.on("cellEdited", async function(cell) {
      try {
        const rowData = cell.getRow().getData()
        const field = cell.getField()
        const value = cell.getValue()

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
          id = `${rowData.streamID}/${rowData.track}`
        } else {
          console.log('No API sync for this table type')
          return
        }

        // Skip if no ID (new row not yet saved)
        if (!id) {
          console.log('No ID found, skipping API sync')
          return
        }

        // PUT update to API
        const updateData = { [field]: value }
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

    jsonTable.on("rowDeleted", async function(row) {
      try {
        const rowData = row.getData()
        console.log('Row deleted:', rowData)

        // Determine API endpoint and ID
        let endpoint, id
        if (p === 'songlist') {
          endpoint = API_CONFIG.ENDPOINTS.songlist
          id = rowData.songID
        } else if (p === 'streamlist') {
          endpoint = API_CONFIG.ENDPOINTS.streamlist
          id = rowData.streamID
        } else if (p === 'setlist') {
          endpoint = API_CONFIG.ENDPOINTS.setlist
          id = `${rowData.streamID}/${rowData.track}`
        } else {
          console.log('No API sync for this table type')
          return
        }

        // Skip if no ID
        if (!id) {
          console.log('No ID found, skipping API delete')
          return
        }

        // DELETE from API
        await apiRequest('DELETE', `${endpoint}/${id}`)

        // Show success message
        $('#setTableMsg').text('Row deleted successfully').addClass('text-bg-success')
        setTimeout(() => {
          $('#setTableMsg').html('&emsp;').removeClass('text-bg-success')
        }, 3000)

      } catch (error) {
        console.error('Error deleting row:', error)
        alert(`Error deleting row: ${error.message}`)
        // TODO: Consider re-adding the row on error
      }
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
        if (col.editor) {
          // 已有 editor 的欄位（如 select2）保持不變
          return { ...col, editable: true }
        }
        // 其他欄位添加預設 input editor
        return { ...col, editor: "input", editable: true }
      })
      jsonTable.setColumns(editableColDef)
      jsonTable.showColumn("YTLink")
      jsonTable.deselectRow()
      $('#setTableMsg').text('You can edit data by clicing cell , or using Excel edit , click the table, and paste to it.').addClass('text-bg-info')
    }
    else{
      // 離開編輯模式：恢復原始欄位定義（移除 editor）
      jsonTable.setColumns(colDef)
      //tell user upload to github
      $('#setTableMsg').text('Please upload the JSON to github.Thanks.').addClass('text-bg-info')
      $('#dljson').click()
      setTimeout(()=>{
        $('#setTableMsg').html('&emsp;').removeClass('text-bg-info')
      },5000)
    }
  })

  // Language switch for songlist
  $('#content').on('change', '#languageSwitch', function(){
    const isEnglishMode = $(this).is(':checked')

    if (isEnglishMode) {
      songlistColDef = songlistColDef_EN
      $('#langJA').removeClass('text-light').addClass('text-muted')
      $('#langEN').removeClass('text-muted').addClass('text-light')
    } else {
      songlistColDef = songlistColDef_JA
      $('#langJA').removeClass('text-muted').addClass('text-light')
      $('#langEN').removeClass('text-light').addClass('text-muted')
    }

    // Update table columns
    jsonTable.setColumns(songlistColDef)
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

      // Add to table
      jsonTable.addRow(newSong, true)

      // Close modal and reset form
      addSongModal.hide()
      $('#modalAddSong form')[0].reset()

      // Show success message
      $('#setTableMsg').text('Song added successfully').addClass('text-bg-success')
      setTimeout(() => {
        $('#setTableMsg').html('&emsp;').removeClass('text-bg-success')
      }, 3000)

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
                                  <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="deleteRowOK">OK</button>`)
      }
      msgModal.show()
  })

  $('#modalFooter').on('click', '#deleteRowOK', ()=>{
    let selectedRows = jsonTable.getSelectedRows()
    jsonTable.blockRedraw()
    selectedRows.forEach(e=>{e.delete()})
    jsonTable.restoreRedraw()

    $('#modalFooter').empty()
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
      tags: true,
      multiple: true,
      width: '100%',
      dropdownParent: $('#modalAddStreamRow'),
      placeholder: categoryData.length === 0 ? 'Type to add categories...' : 'Select or type categories...',
      templateResult: function(data) {
        return data.text;
      },
      templateSelection: function(data) {
        return data.text;
      }
    })

    // Set default category
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

  $('#addStreamRowData').on('click', (e)=>{
      // Select2 multiple already returns array format
      const categories = $('#category').val() || [];

      jsonTable.addRow({
        id:$('#videoID').val(),
        title:$('#streamTitle').val(),
        time:dayjs($('#streamTime').val()).utc().format('YYYY-MM-DDTHH:mm:ss[Z]'),
        category: categories }
        , true)
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
  let origin = ['xfd', 'オリジナル', 'music video']
  let chat = ['chat', 'talk', '雑談']

  if(t.toLowerCase().includes('gam')){return ['ゲーム / Gaming']}
  else if(t.toLowerCase().includes('short')){return ['ショート / Shorts']}
  else if(t.toLowerCase().includes('歌ってみた')){return ['歌ってみた動画 / Cover movie']}
  else if(origin.some(e=>t.toLowerCase().includes(e))){return ['オリジナル曲 / Original Songs']}
  else if(chat.some(e=>t.toLowerCase().includes(e))){return ['雑談 / Chatting']}
  else if(t.includes('歌枠')){return ['歌枠 / Singing']}
  else{return ['other']}
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
        track: startTrack + i,
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
      maxHeight: "100%",
      columns: [
        {title: "Track", field: "track", width: 80, editor: false},
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
    batchTable.on("rowMoved", function() {
      recalculateTrackNumbers()
    })

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
      row.update({ track: startTrack + index })
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

    try {
      // Prepare batch data (songID already stored in rows)
      const batchData = rows.map(row => ({
        streamID: batchStreamData.streamID,
        trackNo: row.track,
        segmentNo: segment,
        songID: row.songID,
        note: row.note || null
      }))

      // Send batch POST request
      const result = await apiRequest('POST', API_CONFIG.ENDPOINTS.setlist, batchData)

      alert(`成功儲存 ${rows.length} 筆歌單資料！`)
      batchEditModal.hide()

      // Reload setlist table if on setlist page
      if (getProcess() === 'setlist') {
        jsonTable.setData(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.setlist)
      }
    } catch (error) {
      console.error('Batch save failed:', error)
      alert('儲存失敗：' + error.message)
    }
  })

  //--- Quick Add Event Handlers ---
  $('#quickStartBtn').on('click', async function() {
    const startTrack = parseInt($('#quickStartTrack').val())
    if (!startTrack || startTrack < 1) {
      alert('請填寫起始 Track 編號')
      $('#quickStartTrack').focus()
      return
    }

    quickCurrentTrack = startTrack
    $('#quickNextTrack').text(quickCurrentTrack)

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
    } catch (error) {
      console.error('Failed to load songlist:', error)
      alert('載入歌曲清單失敗')
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

  // Esc key to close modal
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && quickAddModal._isShown) {
      quickAddModal.hide()
    }
  })

  async function quickAddSong() {
    const songID = $('#quickSongSelect').val()
    const note = $('#quickNote').val()
    const segment = parseInt($('#quickSegment').val()) || 1

    if (!songID) {
      alert('請選擇歌曲')
      $('#quickSongSelect').select2('open')
      return
    }

    try {
      // POST to API immediately
      await apiRequest('POST', API_CONFIG.ENDPOINTS.setlist, {
        streamID: quickStreamData.streamID,
        trackNo: quickCurrentTrack,
        segmentNo: segment,
        songID: parseInt(songID),
        note: note || null
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
      alert('新增失敗：' + error.message)
    }
  }

  // Add new song button in batch editor
  $('#batchAddNewSong').on('click', function() {
    // Close batch editor temporarily
    batchEditModal.hide()

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