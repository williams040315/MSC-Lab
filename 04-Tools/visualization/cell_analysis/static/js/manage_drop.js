
var show_only_progress = function(){

  $('.dz-preview').each(function(){
    var width = parseInt($(this).find('.dz-upload').css('width').split('%')[0])
    if ( width < 2 | width > 99 ) {
        $(this).hide()
    }else{ $(this).show() }
    //alert(width)
  })

}

var manage_drop = function(){

    /*
    Manage the folder dropped on the Dropzone
    */

    var list_addr = []
    var progmin = 0
    var currentpath = ""

    Dropzone.options.dropz = {
          paramName: "file",                                                  // The name that will be used to transfer the file
          maxFiles: 3000,
          maxFilesize: 2000,                                                  // MB
          filesizeBase: 2000,
          success: function(file, response) {

            var newpath = file.fullPath
            console.log("############ newpath ", newpath);
            //alert("############ newpath ", newpath);

            if (list_addr.indexOf(newpath) == -1){                              // if not registered yet.
                 var find_pics = newpath.match(/proc_\d+-\d+.+frame0.png/g)                         //
                 //var find_date = newpath.match(/proc_\d+-\d+/g)                         //
                 if (find_pics){                                                     //

                   $('.listfiles').append($("<li>")                             //
                                  .attr('id', newpath)
                                  .text(newpath + "....")                       // folder name
                                  .append($('<input/>')
                                     .addClass('check')
                                     .attr('id', 'box_' + newpath)
                                     .attr('type', "checkbox").css({'left':'280px', 'top':'-10px'})
                                   )  // end append
                                 ) // end append

                   list_addr.push(newpath)                 // registering the path to avoid repetitions
                  }                                        // end !find_rfp
                }                                          // end if in registered list of paths

           },
          sending: function(file, xhr, data){

              if (typeof (file.fullPath) === "undefined") {
                        file.fullPath = file.name;
                  }
              data.append("fullPath", file.fullPath);
              $('.dz-preview').hide()                       // remove the Thumbnails
              // File upload Progress
          },
          totaluploadprogress: function(progress) {
                  show_only_progress()
                  console.log("############ progress ", progress);
                  if (progress == 100){
                      setTimeout(function(){ $('.dz-complete').find('.dz-filename').hide() }, 1000);
                  }
             }
      }; // end Dropzone.options.dropz

}
