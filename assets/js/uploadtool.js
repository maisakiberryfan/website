//from cdn
import 'https://unpkg.com/jquery@3.7.1/dist/jquery.min.js'
import 'https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js'
import 'https://unpkg.com/bootstrap@5.3.3/dist/js/bootstrap.min.js'
import { Octokit, RequestError } from "https://esm.sh/octokit"

$(async()=> {

    var msgModal = new bootstrap.Modal(document.getElementById('modal'))

    // ------- get file --------
    $('#fileUpload').on('change', (e) => {
        //alert('upload done')
    });

    $('#form').on('submit', async (e)=>{
        e.preventDefault()

        //show msg to user
        $('#modalMsg').html('uploading')
        msgModal.show()

        const file = document.getElementById("fileUpload").files[0]

        var submitInfo = {
            committer: $('#committer').val(),
            msg: $('#msg').val(),
            fileName: file.name,
            fileBase64:await toBase64(file),
        }

        function toBase64(file){
            //from https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
            });
        }

        //------ send file by cloudflare worker ------
        $.ajax({
            url:'https://githubuploader.katani.workers.dev/',
            method: 'POST',
            data:{
                path: submitInfo.fileName,
                message: submitInfo.msg,
                committer: {
                    name: submitInfo.committer,
                },
                content: submitInfo.fileBase64,
            }
        })
        .done((d, textStatus, request)=>{
            d = JSON.parse(d)
            if( d.content === undefined ){ //put fail
                $('#modalMsg').html(`<p>ERROR：${d.message}</p>`)
            }
            else{
                $('#modalMsg').html(`<p>upload success</p><p><a href='${d.content.html_url}'>File on github</p>`)
            }
        })
        .fail((jqXHR, textStatus)=>{
            $('#modalMsg').html(`JQuery AJAX ERROR：${textStatus}`)
        })
        //------ send file by cloudflare worker ------


        // ------ send file by your browser ------
        // you can use your github key to upload file from browser if you wish


        // ------- check file exsit on github --------
        /*const octokit = new Octokit({
            auth: `YOUR_GITHUB_KEY`,
        });
        //test if file exist

        submitInfo.sha = await fileExist(submitInfo.fileName)
        fileUpload(submitInfo)

        async function fileExist(fileName){
            try {
                // your code here that sends at least one Octokit request
                const r = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                    owner: 'maisakiberryfan',
                    repo: 'website',
                    path: fileName,
                    ref: 'test',
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                })
                
                return r.data.sha
    
            } catch (error) {
                // Octokit errors always have a `error.status` property which is the http response code nad it's instance of RequestError
                if (error instanceof RequestError) {
                    //new file
                    return null
                } else {
                // handle all other errors
                throw error;
                }
            }
        }

        // ------- upload to github --------
        async function fileUpload(file){
            try {
                                
                await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                    owner: 'maisakiberryfan',
                    repo: 'website',
                    path: file.fileName,
                    message: file.msg,
                    committer: {
                        name: file.committer,
                        email: 'no-reply@m-b.win'
                    },
                    content: file.fileBase64,
                    sha: file.sha,
                    branch: 'test',
                    headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                    }
                })

                $('#modalMsg').html('upload success')
    
            } catch (error) {
                // Octokit errors always have a `error.status` property which is the http response code nad it's instance of RequestError
                if (error instanceof RequestError) {
                    $('#modalMsg').html(error.message)
                } else {
                // handle all other errors
                throw error;
                }
            }

            msgModal.show()
        }*/


    })//end form sumbit

})
    