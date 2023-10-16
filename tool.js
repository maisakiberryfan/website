//from cdn
import 'https://unpkg.com/jquery@3.7.0/dist/jquery.min.js'
import 'https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js'
import 'https://unpkg.com/bootstrap@5.3.0/dist/js/bootstrap.min.js'
import "https://unpkg.com/tabulator-tables@5.5.0/dist/js/tabulator.min.js"
import "https://unpkg.com/marked@5.1.1/marked.min.js"
import "https://unpkg.com/dayjs@1.11.9/dayjs.min.js"
import "https://unpkg.com/select2@4.0.13/dist/js/select2.full.min.js"

//------  coding by hand  ------
let nav = `
<nav class="navbar fixed-top navbar-expand-lg bg-body-tertiary px-5">
  <div class="container-fluid">
    <a class="navbar-brand" href='/' target='_self'>苺咲べりぃ非公式wiki</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarContent">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link dropdown-item setContent" href='/history' data-ext='.md'>History</a>
        </li>
        <li class="nav-item dropdown">
          <button class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            List&nbsp;&nbsp;&nbsp;
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item setContent" href='/songlist' data-ext=''>Song List</a></li>
            <li><a class="dropdown-item setContent" href='/setlist' data-ext='.json'>Set List</a></li>
            <li><a class="dropdown-item setContent" href='/streamlist' data-ext='.json'>Stream List</a></li>
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
        <li class="nav-item">
          <a class="nav-link dropdown-item setContent" href='/howTo' data-ext='.md'>How To Edit</a>
        </li>
        <li class="nav-item">
          <a class="nav-link dropdown-item" href='https://github.com/maisakiberryfan/website'>
            <span><svg class='w' xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg></span>
          </a>
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
  marked.use({
    mangle: false,
    headerIds: false,
  })

  //message modal 
  var msgModal = new bootstrap.Modal(document.getElementById('modal'))

  $('#nav').html(nav)

  //if direct url
  setContent(location.pathname)

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

    if(path === undefined || path.length < 2 || !path.includes('/') || path === '/index.html'){
      url = 'main.md'
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
          url = 'main.md'
        }
        else{
          title = t.text()+' - '
          process = url
          url+=t.data().ext
          //songlist is a exception
          if(process=='songlist') url='https://hackmd.io/NSAM_dezTrWPQJ0nGWViIQ/download'
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
      document.title = title + '苺咲べりぃ非公式wiki'
      //check if there are some exception page
      if(process=='setlist' || process=='streamlist'){
        let c = `
              <button id='reloadBtn' class='btn btn-outline-light'>Reload Data</button>
              <button id='edit' class='btn btn-outline-light' data-bs-toggle="button">Edit mode</button>
              <button id='`+ (process=='streamlist'?'addStreamRow':'addRow') + `' class='btn btn-outline-light addRow' disabled>Add Row</button>
              <button id='deleteRow' class='btn btn-outline-light'>Delete Row</button>
              <button id='dlcsv' class='btn btn-outline-light'>Get CSV</button>
              <button id='dljson' class='btn btn-outline-light'>Get JSON</button>
              <div id='setTableMsg' class='p-3'>&emsp;</div>
              <div id='tb' class='table-dark table-striped table-bordered'>progressing...</div>
                `
        $("#content").empty().append(c)
        extractUniqueData(d, process)
        configJsonTable(url, process)
      }
      else{
        var c ="<div id='md'>"+marked.parse(d)+"</div>"

        if(process=='songlist'){
          //combine multiple table
          let t = document.createElement('input')
          t.innerHTML = c

          let tr = t.querySelectorAll("#md table tbody tr")
          let tb = t.querySelector("#md table tbody")
          tb.replaceChildren(...tr)
          //table already change
          c = t.querySelector("#md table")
        }

        $("#content").empty().append(c)
        
        //if data is remote, tell the source
        if(url.includes('http')){
          if(url.includes('hackmd.io')) {url=url.replace('/download', '')}
          $("#content").prepend("<div id='source' class='mb-2'>Source: <a href='"+url+"'>"+url+"</a></div>")
        }

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
      })
    })
  }

  // use global variable
  var uniqueData={}

  function extractUniqueData(data, process){
    //pick unique data
    //https://stackoverflow.com/questions/15125920

    if(process=='setlist'){
      uniqueData = 
      {
        song: sortDataForSelect2(data, 'song'),
        singer: sortDataForSelect2(data, 'singer'),
        note: sortDataForSelect2(data, 'note')
      }
    }
    if(process=='streamlist'){
      uniqueData = 
      {
        category: sortDataForSelect2(data, 'category')
      }
      
    }
  }

  function sortDataForSelect2(arr, txt){
    return [...new Set(arr.map(e=>e[txt]))].sort().map(e=>{return {id:e,text:e}})
  }

  //--- url Error ---
  $('#modalFooter').on('click', '#urlError', ()=>{
    setContent()
    $('#modalFooter').empty()
  })

//--- json table ---
  //use a global variable to easy access the table and colDef
  var jsonTable, colDef

  //column definition
  var setlistColDef = [
    {title:"Date", field:"date", validator:dateValid, cellEdited:dateFormatter, width:'150', formatter:"link", formatterParams:{
      urlField:"YTLink",
    }},
    {title:"Track", field:"track", sorter:'number'},
    {title:"Song", field:"song", topCalc:'count', topCalcFormatter:(c=>'total/小計：'+c.getValue()), headerFilter:select2, headerFilterParams:{field:"song"}, headerSort:false},
    {title:"singer", field:"singer", headerFilter:select2, headerFilterParams:{field:"singer"}, headerSort:false},
    {title:"note", field:"note", headerFilter:select2, headerFilterParams:{field:"note"}, headerSort:false},
    {title:"YTLink", field:"YTLink", visible: false, download:true},
  ]

  var streamlistColDef = [
    {title:"thumbnail", formatter:imageLink, headerFilter:false},
    {title:"id", field:"id", visible: false, download:true},
    {title:"title", field:"title", width:300, topCalc:'count',topCalcFormatter:(c=>'total/小計：'+c.getValue()), formatter:multiLineLinkFormat},
    {title:`local time(${dayjs().format('Z')})`, field:"time", mutator:((cell)=>dayjs(cell).format('YYYY/MM/DD HH:mm')), accessor:((value)=>dayjs(value).toJSON())},
    {title:"category", field:"category", headerFilter:select2, headerFilterParams:{field:'category'}, headerSort:false, editor:select2, editorParams:{field:'category'}, formatter:(cell=>{
      cell.getElement().style.whiteSpace ='pre-line'
      return cell.getValue()
      })
    },
    {title:"note", field:"note"},
  ]

  //column definition function
  function multiLineLinkFormat(cell){
    cell.getElement().style.whiteSpace ='pre-line'  //set multi line
    return "<a href='https://www.youtube.com/watch?v=" + cell.getData().id + "'>"+ cell.getValue() +"</a>"
  }

  function imageLink(cell){
    return `<img src='https://i.ytimg.com/vi/${cell.getData().id}/hqdefault.jpg' width="160" height="120">`
  }

  function canEdit(){
    return $('#edit').hasClass('active')
  }

  function dateValid(cell, value, parameters){
    //cell - the cell component for the edited cell
    //value - the new input value of the cell
    //parameters - the parameters passed in with the validator
      return dayjs(value).isValid();
  }

  function dateFormatter (cell){
    //Change format to YYYY/MM/DD
    return cell.setValue(dayjs(cell.getValue()).format('YYYY/MM/DD'))
  }

  function select2 (cell, onRendered, success, cancel, editorParams){
    //use select2 replace header filter
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass thesuccessfully updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell
    //editorParams - params object passed into the editorParams column definition property

    //create input element to hold select
    var editor = document.createElement("input")

    var d = uniqueData[editorParams.field]
    
    onRendered(function(){
      let op = $(editor)

      //console.log(op)
      op.select2({
            data: d,
            width: '300px',
            allowClear: true,
            placeholder:'',
            tags: true,
            //multiple:true //if use multiple, filter have to change to 'in'
      })
      op.val(cell.getValue()).trigger('change')

      op.on('change', function (e) {
        /*let q = $(editor).val()
        if(q.length==0){  //清除
          q = null
        }
        else{
          q = $(editor).val().split(',').filter(e=>e.length>0)
        }*/
        success($(editor).val())
      })

      op.on('blur', function (e) {
          cancel()
      })
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

    jsonTable = new Tabulator("#tb", {
      ajaxURL: u,
      height:700,
      columnDefaults:{
        headerFilter:"input",
        editor:"input",
        editable:canEdit,
      },
      columns:colDef,
      selectable:true,
      selectableRangeMode:"click",
      clipboard:true,
      addRowPos:"top",
    })
  }

  //--- jsonTable button block ---

  $('#content').on('click', '#reloadBtn', ()=>{
    jsonTable.setData()
    jsonTable.clearFilter(true)
    jsonTable.deselectRow()
  })

  $('#content').on('click', '#edit', ()=>{
    jsonTable.setColumns(colDef)
    $('.addRow').prop('disabled', !canEdit())
    $('#deleteRow').prop('disabled', canEdit())

    if(canEdit()){
      jsonTable.showColumn("YTLink")
      jsonTable.deselectRow()
      $('#setTableMsg').text('You can edit data by clicing cell , or using Excel edit , click the table, and paste to it.').addClass('text-bg-info')
    }
    else{
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
    
  $('#content').on('click', '#addRow', ()=>{

    $('#date').val(dayjs().format('YYYY/MM/DD'))
    addRowModal.show()
  })

  $('#addRowData').on('click', ()=>{
    let info = {d:$('#date').val(), y:$('#YTLink').val(), c:Number($('#songs').val())}

    jsonTable.blockRedraw()
    for(let i=info.c; i>0 ; i--){
      jsonTable.addRow({date:info.d, YTLink:info.y, track:i}, true)
    }
    jsonTable.restoreRedraw()
    jsonTable.redraw()
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

  $('#date').on('blur', (e)=>{
    let d = dayjs(e.target.value)
    if(!d.isValid()){
      $('#dateCheck').text('Date not valid')
      $('#date').trigger( "focus" )
    }
    else{
      $('#dateCheck').text('')
      e.target.value=d.format('YYYY/MM/DD')
    }
  })

  //for streamlist (quick solution)

  var addStreamRowModal = new bootstrap.Modal(document.getElementById('modalAddStreamRow'))
  document.getElementById('modalAddStreamRow').addEventListener('shown.bs.modal', () => {
    $('#YTID').focus()
  })
  

  $('#content').on('click', '#addStreamRow', ()=>{
    $('.form-control').val('')
    $('#category').select2({
      data: uniqueData.category,
      allowClear: true,
      tags: true,
      width: '300px',
      dropdownParent: $('#modalAddStreamRow'),
      placeholder: ''
    })
    $('#category').val('歌枠 / Singing').trigger('change');
    $('#streamTitle').prop('disabled', true)
    $('#streamTime').prop('disabled', true)
    addStreamRowModal.show()
  })

  $('#YTID').on('blur', async ()=>{
    // query youtube api get info
    // You can use your API key to query the info
    // https://developers.google.com/youtube/v3/getting-started
    // if you have api key then decomment the following code

    /* const YOUTUBEAPIKEY = 'YOUR_YOUTUBE_API_KEY'
     let url = https://www.googleapis.com/youtube/v3/videos?key=' + YOUTUBEAPIKEY 
           + '&part=id,snippet,liveStreamingDetails'
           + '&fields=items(id,snippet(publishedAt,channelId,title),liveStreamingDetails(scheduledStartTime))'
           + '&id='+id
    */
    

      const BERRYCHANNEL = 'UC7A7bGRVdIwo93nqnA3x-OQ'

      let id = getYoutubeVideoId($('#YTID').val())

      if(id === undefined) return

      //load content
      $.ajax({
        url:'https://getyoutubevideoid.katani.workers.dev/?id='+id,
        })
        .done((d, textStatus, request)=>{
          let info = d.items[0]
          
          //berry's video?
          if(info.snippet.channelId == BERRYCHANNEL){
            let title = info.snippet.title
            $('#streamMsg').html("　")
            $('#streamTitle').val(title)

            if(info.liveStreamingDetails === undefined){
              $('#streamTime').val(info.snippet.publishedAt)
            }
            else{
              $('#streamTime').val(info.liveStreamingDetails.scheduledStartTime)
            }
            
            $('#videoID').val(id)
            $('#category').val(preCategory(title)).trigger('change');
          }
          else{
            $('#streamMsg').html("Not berry's video")
            $('#YTID').val('').focus()
          }    
        })
        .fail((jqXHR, textStatus)=>{
          $('#streamMsg').html("Get video info fail.")
          $('#streamTitle').prop('disabled', false)
          $('#streamTime').prop('disabled', false)
        })

  })
  
  $('#streamTime').on('blur', (e)=>{
    if(e.target.value.length == 0) return
    e.target.value = dayjs(e.target.value).format('YYYY-MM-DD HH:mm:00.000Z')
  })

  $('#addStreamRowData').on('click', (e)=>{
      jsonTable.addRow({
        id:$('#videoID').val(), 
        title:$('#streamTitle').val(), 
        time:dayjs($('#streamTime').val()).toJSON(),
        category:$('#category').val() }
        , true)
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
  
  let ytPrefix = ['https://www.youtube.com/watch?v=','https://www.youtube.com/live/','https://youtu.be/']
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

  if(t.includes('歌枠')){return '歌枠 / Singing'}
  else if(t.toLowerCase().includes('gam')){return 'ゲーム / Gaming'}
  else if(t.toLowerCase().includes('short')){return 'ショート / Shorts'}
  else if(t.toLowerCase().includes('歌ってみた')){return '歌ってみた動画 / Cover movie'}
  else if(origin.some(e=>t.toLowerCase().includes(e))){return 'オリジナル曲 / Original Songs'}
  else if(chat.some(e=>t.toLowerCase().includes(e))){return '雑談 / Chatting'}
  else{return 'other'}
}

})//end ready