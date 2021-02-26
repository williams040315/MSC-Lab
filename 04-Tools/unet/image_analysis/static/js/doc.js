
var docstyle = function(){

    /*
    Improve the Markdown style for the doc
    */



       /*
        Give the possibility to change size of images, [img widthxheight](href)
        */

        $("img").each(function(){               // retrieve and change size images
                var reg_im = /\s*\d*x\d*\s*/
                if ($(this).attr('alt').match(reg_im)){
                    var sizeim = $(this).attr('alt').match(reg_im)[0];
                    $(this).attr('width',sizeim.split('x')[0]);
                    $(this).attr('height',sizeim.split('x')[1])
                }
            })

        //===================================================================== triple </p>

        $('p').each(function(){
          var txt = $(this).text()
          if (txt.match(/\$triple/)){
            // alert('found !!!')
            newtxt = txt.replace('$triple', '' )
            var pt = $('</p>').text('.').css({'color':'white'})
            $(this).after(pt).after(pt).after(pt).after(pt).after(pt)
            $(this).text(newtxt)
          }

        })

         //===================================================================== separating line

            /*
            Simple line separation on the page.
            syntax : $*
            */

            $("p").each(function(){
              txt = $(this).text()
              if (txt.match(/^\$\*/)) {
                    $(this).replaceWith($('<hr/>'))
                  }   // end if txt.mtch
                  $(this).before('</div>').after('</div>')
              })   // end each p

        $('#titletoc').click(function(){
             $('.sub').toggle()
           if( $('.toc').css('height') == 'auto'){
              $('.toc').css({'height':'50px'})
           }
           else{
              $('.toc').css({'height':'auto'})
           }

          })

        $('h2').each(function(){            // making toc on h2
            $(this).css({'color':'#b32d00', 'text-align':'center'})
            // alert($(this).text())
            var link = $('<a/>').append('• ' + $(this).text()).attr('href', '#' + $(this).text()).css({'color':"rgb(179, 45, 0)"}).addClass("tocelem")  // link
            //alert($(this).prev().prev().prev().text())
            //$(this).prev().prev().prev().append($('<a/>').attr('name', $(this).text()))                                  // anchor (link target)
            // alert($(this).text())
            // alert($(this).prev('p').prev().text())
            $(this).prev('p').prev().prev().append($('<a/>').attr('name', $(this).text()))
            var newdiv = $('<div/>').append(link).addClass('sub')
            $('.toc').append(newdiv) // add new link
          })

        var link_proc = $('<a/>').html('Processing')
                                 .attr('href', 'ask_param')
                                 .css({'right':'10%'})
        var link_visu = $('<a/>').html('Visualisation')
                                 .attr('href', 'visu_results')
                                 .css({'padding-left':'20px'})
        $('#headline').after($('<div/>').css({'padding-top':'10px'}).append(link_proc).append(link_visu))

        $('p').each(function(){
          var txt = $(this).text()
          if (txt.match(/\$indent/)){
            //alert('found it')
            newtxt = txt.replace("$indent", "    ")
            $(this).text(newtxt).css({'text-indent': '50px'})
          }   // end if
        })  // end each

        /*
        Frame for equations
        */

        $('p').each(function(){
          var txt = $(this).text()
          if (txt.match(/\$eq/)){
            // alert(txt)
            newtxt = txt.replace("$eq", " ")
            $(this).text(newtxt).wrap("<div class='eq'></div>")
          }   // end if
        })  // end each

        /*
        Activating or not box shadow for equations
        */

        $('.eq').each(function(){
            $(this).css({"box-shadow": "none"})
        })

        // Colors

        var buc = function(pli){

            var stl = ['b','u','c'] // 'b', 'u',
            for (i in stl){
                var currstl = stl[i]
                // alert(currstl)
                pli.each(function(){
                    var txt = $(this).html().replace(/\<br\>/g, ' <br>'); // .replace('<br>',' ')
                    if (currstl != 'c'){
                        var re = new RegExp('\"[^"]+\"' + currstl + ' ', 'g')   // case color
                        }
                    else{
                        var re = new RegExp('\"[^"]+\"' + currstl + '\.' +  ' ', 'g') // case b or u
                    }
                    var tm = txt.match(re)
                    if (tm){
                        for (i in tm){
                            // alert(tm[i])
                            txtm = tm[i].toString()
                            //alert(stl[i])
                            if (currstl != 'c'){               // case b or u
                                var ttmm = txtm.slice(1,-3)
                                nwstl = '<'+ currstl +'>' + ttmm  + '</'+ currstl +'>' + ' '
                                // alert(nwstl)
                                var bu = new RegExp(tm[i], 'g')
                                var txt = txt.replace(bu, nwstl)
                                //alert("newtxt " + txt)
                                $(this).html(txt)
                            }
                            else if (currstl == 'c'){    // case color
                                // alert('Text matched for color is ' + txtm)
                                dic_col = {'r':'red', 'b':'blue', 'y':'yellow', 'g':'green', 'o':'orange', 'm':'magenta'}
                                var ttmm = txtm.slice(1,-4)
                                var col = txtm.slice(-2).trim()
                                //alert(col)
                                var nwstl =  $('<span/>').text(ttmm + ' ').css({'color':dic_col[col]})
                                interm = $('<div/>').append(nwstl)
                                //alert(interm.html())
                                var cc = new RegExp(tm[i], 'g')
                                var txt = txt.replace(cc, interm.html())
                                $(this).html(txt)
                                // alert(col)
                                // alert(txt)
                            }
                        } // end for (i in tm) i in text matched
                      }  // end if tm
                 }) // end each p, li
            } // end for (i in stl)
        }

        buc($("li"))  // dealing with p
        buc($("p"))  // dealing with p

        $('body').css({"background-color":"#ffffff"})
        $('.tocelem').css({"color":"##fff2e6"})

}
