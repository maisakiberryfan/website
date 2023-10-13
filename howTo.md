## For now Chinese only.
---

### 主要使用
* [JQuery](https://jquery.com/) 對我就是爛，吃語法糖
* [bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/) 排版
* [tabulator](https://tabulator.info/) 表格
* [marked](https://marked.js.org/) markdown轉html
* [dayjs](https://day.js.org/) 時間處理

### 如何維護上方NavBar(導覽列)
* 目前html寫死，未來可能會有較靈活寫法，如果有人願意幫忙改是最好www

* 階層部分請參照[bootstrap說明](https://getbootstrap.com/docs/5.3/components/navbar/)

* 若為對外連結不太需要改什麼，class部分請依bootstrap範例處理
    ```
    <li><a class="dropdown-item" href="https://seesaawiki.jp/maisakiberry/">seesaawiki</a></li>
    ```

* 若為站內連結，請在class加上```setContent```, 連結的部分為``/``加檔名```setlist```, 副檔名放在```data-ext```裡
    ```
    <li><a class="dropdown-item setContent" href='/setlist' data-ext='.json'>Set List</a></li>
    ```

### 如何編輯setlist表格
#### <p class='text-danger'>操作後***務必***上傳setlist.json到github上，不然就是改爽的</p>
##### 刪除
* 直接點選table上要刪的資料(可用shift及ctrl多選)，再按下Delete Row
* 在編輯模式下避免干擾不給刪
##### 更新
* 少部分要更新的話，點選edit mode後，在要更新的資料上點一下滑鼠即可更新
* 如果要更新很多時，請使用刪除後新增的方法
##### 新增
* 如果想手工維護的話，按下Add row，出現詢問窗(日期/youtube link/曲數)，依要求填入後會自動新增對應的曲數
* 如果已有資料(如KL的歌單)，建議使用excel做編輯，Excel完成後點table(大螢幕最後欄應該是空的，點那邊比較簡單)，ctrl-V即可新增
* 如果沒有Excel之類的，可以使用notepad之類的文字編輯器，tabulator認的是tab(\t)跟enter(\n)
* 或想直接產出json檔也可，表格轉換可參考[表格轉換工具](https://tableconvert.com/zh-tw/)

### 如何編輯setlist頁面外之表格
* 除songlist是直接抓取ahckmd後再處理，不提供編輯外，其他的跟setlist差不多