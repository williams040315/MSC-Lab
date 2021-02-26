//break,  Imaging, Analysis, uFluidics
//mise a jour en fonction des niveaux

    var ws;
    var wsUri = "ws:";
    var loc = window.location;
    var order = 'getRessources' ;
    var nbOfSettingsChannels = -1;
    var nbOfMdaConfiguration = -1;
    var ressources =  []; var settingschannels = []; var listConfigChannel = []; var listConfigMda = []; var configChannel = [];
    var nodeParameters = {}; //nodeParameters.key = 10000000000000000 ; 
    var openBox = false ;
    var treeName = 'empty.json';
    var newSourceOption = ""; var newSourceOptionId = "";    
    var CLIPBOARD = null;
    var globalParam = ["LCPlanFl 40x",250,250,2.90,1,10,5,50, 0,500,25,2,'OFF','OFF','ON','GFP',-50,50,10,75]; var SC = ["BF","YFP","GFP","RFP"]; var world = {'NCELL' : 100,'ITERATOR' : 3,'IMG_BLACK' : false,'IMG_WHITE' : false,'IMG_NOISE' : false};        
    var mask = ''; var replaceKey = 1 ; var initKey = true ; 
    var listLoop = []; var listMain = [];
    
    $(function(){
        $("#tree").fancytree({
            checkbox: false,
            tooltip: function(event, data) {
                var node = data.node;
                if( node.type === "PROT" )      return "Protocole";
                if( node.type === "LOOP" )      return "Sequence";
                if( node.type === "XYZ" )       return "XYZ position";
                if(node.type === "LIGHT")       return "Lighting";
                if(node.type === "GROUP")       return "Group position";
                if(node.type === "List")        return "List position";
                if(node.type === "CAMERA")      return "Camera";
                if(node.type === "Imaging")     return "Imaging";
                if(node.type === "AF")          return "Autofocus";
                if(node.type === "ZS")          return "Z-Stack";
                if(node.type === "Mosaic")      return "Mosaic";
                if(node.type === "Slack")       return "Slack";
                if(node.type === "Delay")       return "Delay";
                if(node.type === "LIST")        return "List_of_Positions";
                if(node.type === "µFluidic")    return "µFluidic";
                if(node.type === "Analysis")    return "Analysis";
                if(node.type === "IF")          return "IF";
                if(node.type === "STOP")        return "STOP";
                if(node.type === "BREAK")       return "BREAK";
                if(node.type === "Goto")       return "Goto";
            },
            icon: function(event, data) {
                var node = data.node;
                if( node.type === "XYZ" )       return "fancytree-master/demo/skin-custom/yxz-512.png";
                if(node.type === "LIGHT")       return "fancytree-master/demo/skin-custom/color_wheel.png";
                if(node.type === "CAMERA")      return "fancytree-master/demo/skin-custom/camera.png";
                if(node.type === "AF")          return "fancytree-master/demo/skin-custom/autofocus.png";
                if(node.type === "ZS")          return "fancytree-master/demo/skin-custom/zstack.png";
                if(node.type === "GROUP")       return "icons/plugin.png";
                if(node.type === "LIST")        return "icons/text_list_numbers.png";
                if( node.type === "LOOP" )      return "fancytree-master/demo/skin-custom/arrow_rotate_clockwise.png";
                if( node.type === "Mosaic" )    return "icons/application_osx_terminal.png";
                if( node.type === "Slack" )     return "icons/phone_sound.png";
                if( node.type === "Imaging" )   return "icons/image.png";
                if( node.type === "Delay" )     return "icons/clock.png";
                if(node.type === "µFluidic")    return "icons/uf2.png";
                if(node.type === "IF")          return "icons/if.png";
                if(node.type === "STOP")        return "icons/stop.png";
                if(node.type === "BREAK")       return "icons/bullet_red.png";
                if(node.type === "Analysis")    return "icons/color_swatch.png";
                if(node.type === "Goto")        return "icons/003-rightB.png";
                if( node.type === "PROT" )  { 
                    newSourceOptionId = node.data.config; 
                    return "fancytree-master/demo/skin-custom/protocol.png";}
            },
            titlesTabbable: true,
            quicksearch: true,
            source: { url: 'mda/'+treeName},
            //extensions: ["edit", "dnd5", "table", "gridnav","multi"],
            extensions: ["edit", "dnd5", "table", "gridnav"],
            unselectable: function(event, data) {
            return data.node.isFolder();
            },
            multi: {
            mode: "sameParent",
            },
            activate: function(event, data) {
                $("#lblActive").empty();
                $("#lblActive").append("<div id='lblActiveName'></div>");
                //$("#lblActiveName").append("Edit function:  " + data.node.title);
                nodeParameters = data.node ;
                $('#wPaint').wPaint('clear');
                if(data.node.type==='Imaging'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    $("#lblActive").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='ImagingTitle' onChange='updateImaging()'></input>");      
                    checked = '';
                    if(data.node.data.autofocus) {nameType = nameType + '| AF' ; checked = 'checked';}

                    $("#lblActive").append("<hr><label style='width:200px'>AutoFocus</label><input " + checked + " type = 'checkbox' id='ImagingAutofocus' onClick='updateImaging()'></input><div id='ImagingAutofocusDiv'></div>");
                    //$("#ImagingAutofocusDiv").empty();
                    $("#ImagingAutofocusDiv").append("<small><label style='width:200px'>Objective</label><input value='"+nodeParameters.data.aftbl +"' type = 'text' id='ImagingAutofocusObjective' onClick='updateImaging()'></input><br></small>");
                    $("#ImagingAutofocusDiv").append("<small><label style='width:200px'>Lower limit [µm]</label><input value='"+nodeParameters.data.lower+"' type = 'number' id='ImagingAutofocusLower' onClick='updateImaging()'></input><br></small>");
                    $("#ImagingAutofocusDiv").append("<small><label style='width:200px'>Upper limit [µm]</label><input value='"+nodeParameters.data.upper+"' type = 'number' id='ImagingAutofocusUpper' onClick='updateImaging()'></input><br></small>");
                    $("#ImagingAutofocusDiv").append("<small><label style='width:200px'>Offset [µm]</label><input value='"+nodeParameters.data.offset+"' type = 'number' id='ImagingAutofocusOffset'></input><button title='update autofocus parameters'><img src='icons/autofocus.png'></img></button><br></small>");
                    $("#ImagingAutofocusDiv").append("<small><label style='width:200px'>Refocus</label><input  type = 'text' id='ImagingAutofocusStatus'></input><button title='refocus'><img src='icons/shape_align_top.png'></img></button><br></small>");
                    $("#ImagingAutofocusDiv").hide();
                    $("#ImagingAutofocusDiv").append("<br><small><label style='width:200px'>Z position [µm]</label><input value='"+data.node.data.zPosition/100+"' type = 'number' id='ImagingAutofocusZPosition' onClick='updateImaging()'></input><button title='update z position'><img src='icons/yxz-512.png'></img></button><br></small>");
                    if(checked=='checked'){          
                        $("#ImagingAutofocusDiv").show();  
                    } else $("#ImagingAutofocusDiv").hide();


                    checked = '';
                    if(data.node.data.picture){nameType = nameType + '| img'; checked = 'checked';}
                    $("#lblActive").append("<hr><label style='width:200px'>Simple picture</label><input name='imgType' " + checked + " type = 'radio' id='ImagingPicture' onClick='updateImaging()'></input>");
                    checked = '';
                    if(data.node.data.zstack){nameType = nameType + '| zs'; checked = 'checked';}
                    $("#lblActive").append("<hr><label style='width:200px'>Z-stack</label><input name='imgType' " + checked + " type = 'radio' id='ImagingZstack' onClick='updateImaging()'></input><div id='ImagingZstackDiv'></div>");
//                    $("#ImagingZstackDiv").empty();
                    $("#ImagingZstackDiv").append("<small><label style='width:200px'>Z Start [µm]</label><input value='"+data.node.data.zstart +"' type = 'number' id='ImagingZstackzstart' onClick='updateImaging()'></input><br></small>");
                    $("#ImagingZstackDiv").append("<small><label style='width:200px'>Z Stop [µm]</label><input value='"+data.node.data.zend+"' type = 'number' id='ImagingZstackzstop' onClick='updateImaging()'></input><br></small>");
                    $("#ImagingZstackDiv").append("<small><label style='width:200px'>Step [µm]</label><input value='"+data.node.data.zstep+"' type = 'number' id='ImagingZstackstep' onClick='updateImaging()'></input></small>");
                    $("#ImagingZstackDiv").hide();
                    if(checked=='checked'){            
                        $("#ImagingZstackDiv").show();
                    } else $("#ImagingZstackDiv").hide();
                    nameType = nameType + '['+nodeParameters.data.settingchannels+':';
                    nameType = nameType + nodeParameters.data.timeexposure+'ms]';
            
                    checked = '';
                    if(data.node.data.mosaic){checked = 'checked';nameType = nameType + '| M';}
                    $("#lblActive").append("<hr><label style='width:200px'>Mosaic</label><input " + checked + " type = 'checkbox' id='ImagingMosaic' onClick='updateImaging()'></input><div id='ImagingMosaicDiv'>");
                    $("#ImagingMosaicDiv").append("<small><label style='width:200px'>Exposing the mask (60s)</label><button onClick='updateImaging()'><img src='icons/color_swatch.png'></button></small><br>");
                    $("#ImagingMosaicDiv").append("<small><label style='width:200px'>Stop exposing</label><button onClick='updateImaging()'><img src='icons/cancel.png'></button></small>");
                    if(checked=='checked'){            
                        $("#ImagingMosaicDiv").show();
                        $('#wPaint').wPaint('image', data.node.data.mask);
                    } else{
                        if(data.node.data.mask == '') $('#wPaint').wPaint('clear');
                        else $('#wPaint').wPaint('image',data.node.data.mask);
                       $("#ImagingMosaicDiv").hide();
                    }
                    
                    value = data.node.data.timeexposure ;
                    $("#lblActive").append("<hr><label style='width:200px'>Time exposure (ms):</label><input step='1' value=" + value + " type = 'number' id='ImagingTimeexposure' onChange='updateImaging()'></input>");      

                    value = data.node.data.settingchannels ;
                    $("#lblActive").append("<hr><label style='width:200px'>Setting channel:</label>");
                    $("#lblActive").append("<select id='ImagingSettingChannels' onChange='updateImaging()'></select>");
                    var select = ''
                    for(var scan=0; scan<4;scan++){
                        if (SC[scan] === value) select = 'selected';
                        else select = '';
                        $('#ImagingSettingChannels').append("<option "+select+" value=" + scan +" name=" + SC[scan] + ">" + SC[scan]  + "</option>");                        

                    }
                    //nodeParameters.setTitle(nameType);        
                    $("#lblActiveName").empty();
                    //$("#lblActiveName").append("Edit function:  " + nameType);
                }
                if(data.node.type==='PROT'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    $("#lblActiveName").empty();
                    $("#lblActiveName").append("<fieldset><legend><small>Edit protocole: "+value+"</small></fieldset>");
                    
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='ProtTitle' onChange='updateProt(true)'></input><br>");      
                    
                    value = data.node.data.microscope ;
                    $("#lblActive").append("<label style='width:200px'>Miscroscope:</label><select id='ProtMic' onChange='updateProt(true)'><option name=MissMarple value='MissMarple'>MissMarple</option><option name=DrWho value='DrWho'>DrWho</option><option name=Mustard value='Mustard'>Mustard</option><option name=Sherlock value='Sherlock'>Sherlock</option></select><br>");                      
                    $("#ProtMic option[value='"+value+"']").prop('selected', true);

                    value = data.node.data.exp ;
                    $("#lblActive").append("<label style='width:200px'>Type:</label><select id='ProtType' onChange='updateProt(true)'><option name=MicroFluidic value='MicroFluidic'>MicroFluidic</option><option name=OptoGenetic value='OptoGenetic'>OptoGenetic</option></select><br>");                      
                    $("#ProtType option[value='"+value+"']").prop('selected', true);

                    value = data.node.data.date ;
                    $("#lblActive").append("<label style='width:200px'>Date:</label><input value=" + value + " type = 'text' id='ProtDate' onChange='updateProt(true)'></input><br>");                      

                    
                    value = data.node.data.folder ;
                    nameType = nameType + '| folder['+value+']' ;  
                    $("#lblActive").append("<label style='width:200px'>Folder (target):</label><input  type = 'text' placeholder='agardpad' id='ProtFolder' onChange='updateProt(true)' value=" + value + "></input><br>");                      
                    
                    value = data.node.data.prefixe ;
                    $("#lblActive").append("<label style='width:200px'>Prefixe (image):</label><input  type = 'text' placeholder='agardpad' id='ProtPrefixe' onChange='updateProt(true)' value=" + value + "></input><br>");                      
                    
                    value = data.node.data.author ;
                    $("#lblActive").append("<label style='width:200px'>Author:</label><select id='ProtAuthor' onChange='updateProt(true)'><option name=WilliamsB value='WilliamsB'>WilliamsB</option><option name=CélineC value='CélineC'>CélineC</option><option name=MatthiasL value='MatthiasL'>MatthiasL</option><option name=SylvainP value='SylvainP'>SylavainP</option><option name=AlvaroB value='AlvaroB'>AlvaroB</option></select><br>");                      
                    $("#ProtAuthor option[value='"+value+"']").prop('selected', true);
                    nameType = nameType + ' | author['+$('#ProtAuthor').find('option:selected').attr("name")+']' ;
                   
                     value = data.node.data.comment ;
                    $("#lblActive").append("<label style='width:200px'>Comment:</label><textarea rows='4' cols='50' id='ProtComment' onkeyup='updateProt(true)'>" + value + "</textarea><br>");      
                   
                    $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>Folder (target) : this setting allows Cyberscope to save all of your images to a specific directory. It will be created if it does not exist.<br></fieldset><br>Prefixe (image) : the image prefix adds a prefix to the name of the current image that allows you to identify your data more quickly.<br> <br>During the course of the program, all of your data will be available in real time: [server]/Author/Folder/Prefixe_image_courante.tiff");
                    //nodeParameters.setTitle(nameType);             
                }
                if(data.node.type==='LIST'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    var nameType = '' ;
                    nameType = nameType + value ;                  
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='ListTitle' onChange='updateList(true)'></input><br>");      
                    if(data.node.children==null){
                        value = 0;
                        $("#lblActive").append("<label style='width:200px'>Number of position:</label><input readonly value=0 type = 'text' id='ListnPos'></input><br>");      
                    } else {
                        value = data.node.children.length;
                        $("#lblActive").append("<label style='width:200px'>Number of position:</label><input readonly value="+value+" type = 'text' id='ListnPos'></input><br>");      
                    }
                    $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>The position list node groups together only a set of positions on which a set of functions will be performed.");
                    
                    //nodeParameters.setTitle(nameType + '| positions['+value+']');             
                    $("#lblActiveName").empty();
                    //$("#lblActiveName").append("Edit function:  " + nameType + '| positions['+value+']');
                    $("#lblActiveName").append("<fieldset><legend><small>Edit list of positions: "+nameType+"</small></fieldset>");
                                        
                }
                if(data.node.type==='Delay'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    $("#lblActiveName").append("<fieldset><legend><small>Edit delay: "+value+"</small></fieldset>");
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='DelayTitle' onChange='updateDelay(true)'></input><br>");      
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    value = data.node.data.time ;
                    $("#lblActive").append("<label style='width:200px'>Time(in seconds):</label><input min='1' step='1' value=" + value + " type = 'number' id='DelayTime' onChange='updateDelay(true)'></input><br>");      
                    nameType = nameType + '| time['+value+'sec]' ;  
                    //nodeParameters.setTitle(nameType);
                     $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>This function allows you to program a waiting time in your protocol.");
                    
                }
                if(data.node.type==='IF'){
                    $('#lblActiveEsttimatedTime').empty();
                    console.log(data.node);
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    $("#lblActiveName").append("<fieldset><legend><small>Edit condition if: "+value+"</small></fieldset>");
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='IfTitle' onChange='updateIf(true)'></input><br>");      
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    var checked = '';
                    if(data.node.data.time) {nameType = nameType + '| extent[Yes]' ;  checked = 'checked';}
                    else {nameType = nameType + '| extent[No]';}
                    $("#lblActive").append("<label style='width:200px'>Extent time:</label><input " + checked + " type = 'checkbox' id='IfTime' onChange='updateIf(true)'></input><br>");      
                    value = data.node.data.condition ;
                    $("#lblActive").append("<label style='width:200px'>Condition:</label><textarea rows='5' cols='50' id='IfCondition' onkeyup='updateIf(true)'>" + value + "</textarea><br>");      
                    //value = data.node.data.formatedCondition ;
                    //$("#lblActive").append("<label style='width:200px'>Formated condition:</label><p id='IfFormatedCondition'>" + value + "</p>");      
                    //nodeParameters.setTitle(nameType);
                
                    $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/tag.png'/>&nbsp;Try the condition</small></legend></fieldset>");
                    $("#lblActive").append("<div id='NCELL'><label style='width:200px'>NCELL:</label><input value=" + world['NCELL'] + " type = 'number' id='IfNCELL' onChange='updateIf(true)'></input></div>");      
                    $("#lblActive").append("<div id='ITERATOR'><label style='width:200px'>ITERATOR:</label><input value=" + world['ITERATOR'] + " type = 'number' id='IfITERATOR' onChange='updateIf(true)'></input></div>");      
                 
                    $("#lblActive").append("<div id='IMG_BLACK'><label style='width:200px'>IMG_BLACK:</label><select id='IfIMG_BLACK' onChange='updateIf(true)'><option name=true value=true>true</option><option name=false value=false>false</option></select></div>");                      
                    $("#IfIMG_BLACK option[value='"+world['IMG_BLACK']+"']").prop('selected', true);
                    $("#lblActive").append("<div id='IMG_WHITE'><label style='width:200px'>IMG_WHITE:</label><select id='IfIMG_WHITE' onChange='updateIf(true)'><option name=true value=true>true</option><option name=false value=false>false</option></select></div>");                      
                    $("#IfIMG_WHITE option[value='"+world['IMG_WHITE']+"']").prop('selected', true);
                    $("#lblActive").append("<div id='IMG_NOISE'><label style='width:200px'>IMG_NOISE:</label><select id='IfIMG_NOISE' onChange='updateIf(true)'><option name=true value=true>true</option><option name=false value=false>false</option></select></div>");                      
                    $("#IfIMG_NOISE option[value='"+world['IMG_NOISE']+"']").prop('selected', true);
                    $("#lblActive").append("<div id='TRY'><label style='width:200px'></label><button onClick('updateIf(true);')><img src='icons/tag.png' >&nbsp;&nbsp;Try the condition&nbsp;&nbsp;<img src='icons/tag.png'></button><div>");      
                    $("#lblActive").append("<div id='RESULT'><label style='width:200px'>Result:</label><input style='color: white;'  value='' type = 'input' id='IfResult' onChange='updateIf(true)'></input></div>");      
                    $("#N_CELL").hide();$("#ITERATOR").hide();$("#IMG_BLACK").hide();$("#IMG_WHITE").hide();$("#IMG_NOISE").hide();$("#TRY").hide();$("#RESULT").hide();
                    
                    var o = false ;
                    for(var key in world){
                        if (data.node.data.condition.search(key)!==-1) {$("#"+key).show();o=true;}
                        else {$("#"+key).hide();}
                    }
                    if(o) {$("#RESULT").show();}
                    else {$("#RESULT").hide();}
                   
                    var f = data.node.data.condition;
                    f = f.replaceAll('ITERATOR', $("#IfITERATOR").val()).replaceAll('N_CELL', $("#IfNCELL").val()).replaceAll('IMG_BLACK', $('#IfIMG_BLACK').find(":selected").val()).replaceAll('IMG_NOISE', $('#IfIMG_NOISE').find(":selected").val()).replaceAll('IMG_WHITE', $('#IfIMG_WHITE').find(":selected").val()) ;
                    try {var r = eval(f) ;$("#IfResult").val(r); $("#IfResult").css("background","green");}
                    catch(e){ $("#IfResult").val('SyntaxError: Unexpected end of script'); $("#IfResult").css("background","red");}
                    
                    
                    $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>Condition : this field allows you to edit a condition. If this condition is true, the associated actions and functions will be executed. The keywords are: NCELL, IMG_BLACK, IMG WHITE and IMG NOISE.<br>NCELL: number of cells or nuclei in an image<br>IMG_BLACK: boolean which indicates if an image is completely black<br>IMG_WHITE: boolean which indicates if an image is completely white<br>IMG_NOISE: boolean which indicates if the image contains noise<br><br>Try the condition : you can test your condition with the input variables in the test section<br><br>Extent time : not yet available</fieldset>");
                }
                
                if(data.node.type==='Analysis'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    $("#lblActiveName").append("<fieldset><legend><small>Edit analysis: "+value+"</small></fieldset>");
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='AnalysisTitle' onChange='updateAnalysis(true)'></input><br>");      

                    //checked = '';
                    //if(data.node.data.definedAlgo) checked = 'checked';
                    //$("#lblActive").append("<hr><label style='width:200px'>Defined algorithm</label><input name='algoType' " + checked + " type = 'radio' id='AnalysisDefinedAlgo' onClick='updateAnalysis(true)'></input><div id='AnalysisDefinedAlgoDiv'></div>");
                    $("#lblActive").append("<div id='AnalysisDefinedAlgoDiv'></div>");
                    $("#AnalysisDefinedAlgoDiv").append("<small><label style='width:200px'>Name:</label><select id='AnalysisDefinedAlgos' onChange='updateAnalysis(true)'><option name=SpotDetection.py value=0>SpotDetection.py</option><option name=UNET.py value=1>UNET.py</option></select><br></small>");
                    $('#AnalysisDefinedAlgos option[value="'+nodeParameters.data.definedAlgoName+'"]').prop('selected', true);
                    value = nodeParameters.data.definedAlgoComment[nodeParameters.data.definedAlgoName] ;
                    $("#AnalysisDefinedAlgoDiv").append("<small><label style='width:200px'>Comment:</label><textarea readonly rows='4' cols='50' id='AnanysisDefinedAlgoComment' >" + value + "</textarea></small>");
                    
                    $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>You can use an external python script for the purpose of analyzing the current image that has been made. The output object can be reused in the conditional node IF.</fieldset>");
                
                    //if(checked=='checked'){$("#AnalysisDefinedAlgoDiv").show();nameType = nameType + '| algorithm['+$('#AnalysisDefinedAlgos').find('option:selected').attr("name")+']';}       
                    //else $("#AnalysisDefinedAlgoDiv").hide();

                    //checked = '';
                    //if(data.node.data.ownAlgo) checked = 'checked';
                    //$("#lblActive").append("<hr><label style='width:200px'>Own algorithm</label><input name='algoType' " + checked + " type = 'radio' id='AnalysisOwnAlgo' onClick='updateAnalysis(true)'></input><div id='AnalysisOwnAlgoDiv0'></div><div id='AnalysisOwnAlgoDiv'></div>");
                    //$("#AnalysisOwnAlgoDiv0").append("<small><label style='width:200px'>Name:</label><select id='AnalysisOwnAlgos' onChange='updateAnalysis(true)'></select><br></small>");
                    //$('#AnalysisOwnAlgos option[value="'+nodeParameters.data.ownAlgoName+'"]').prop('selected', true);
                    //value = nodeParameters.data.ownAlgoComment[nodeParameters.data.ownAlgoName] ;
                    //$("#AnalysisOwnAlgoDiv").append("<small><label style='width:200px'>Comment:</label><textarea rows='4' cols='50'  id='AnalysisOwnAlgoComment' >" + value + "</textarea></small>");  
                    //$("#AnalysisOwnAlgoDiv0").hide();
                    //if(nodeParameters.data.ownAlgoComment.length!==0) $("#AnalysisOwnAlgoDiv0").show();
                    //$("#AnalysisOwnAlgoDiv").append("<br><small><label style='width:20px'>Upload:</label><input type='file' id='AnalysisOwnAlgoFile'/></small>");
                    //$("#AnalysisOwnAlgoDiv").append("<br><small><label style='width:200px'>Submit</label><button onClick='updateAnalysis(true)' id='AnalysisOwnAlgoSubmit'>Submit the script</button></small>");
                    
                    //if(checked=='checked') {$("#AnalysisOwnAlgoDiv").show();nameType = nameType + '| algorithm['+$('#AnalysisOwnAlgos').find('option:selected').attr("name")+']';}
                    //else $("#AnalysisOwnAlgoDiv").hide();
       
                }

                if(data.node.type==='Slack'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    $("#lblActiveName").append("<fieldset><legend><small>Edit slack message: "+value+"</small></fieldset>");
                    
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='SlackTitle' onChange='updateSlack(true)'></input><br>");      
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    value = data.node.data.type ;
                    $("#lblActive").append("<label style='width:200px'>Type:</label><select id='SlackType' onChange='updateSlack(true)'><option name=Simple value=0>Simple message</option><option name=Alert value=1>Alert message</option><option name=Warning value=2>Warning message</option></select><br>");      
                    $("#SlackType option[value='"+value+"']").prop('selected', true);
                    nameType = nameType + ' | type['+$('#SlackType').find('option:selected').attr("name")+']' ;
                    value = data.node.data.message ;
                    $("#lblActive").append("<label style='width:200px'>Message:</label><textarea rows='4' cols='50' id='SlackMessage' onkeyup='updateSlack(true)'>" + value + "</textarea><br>");      
                   // nodeParameters.setTitle(nameType);
                    $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>This function allows you to send a message in the Cyberscope / Slack channel () during the protocol.</fielset>");
                    
                }

                if(data.node.type === 'BREAK'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    $("#lblActiveName").append("<fieldset><legend><small>Edit break: "+value+"</small></fieldset>");
                    
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='BreakTitle' onChange='updateBreak(true)'></input><br>");      
                    $("#lblActive").append("<label style='width:200px'>ID Loop:</label><select id='BreakWhere' onChange='updateBreak(true)'></option><br>");      
                    listLoop = [];
                    nameLoop(nodeParameters);
                    for(var key in listLoop){
                        $("#BreakWhere").append("<option name="+listLoop[key]+" value="+listLoop[key]+">Break Loop ID "+listLoop[key]+"</option>")
                    }
                    value = data.node.data.where ;
                    $("#BreakWhere option[value='"+value+"']").prop('selected', true);
                   
                   $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>This function is used to stop a loop during execution.</fielset>");
                    
                }
                if(data.node.type === 'Goto'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    $("#lblActiveName").append("<fieldset><legend><small>Edit goto: "+value+"</small></fieldset>");
                    
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='GotoTitle' onChange='updateGoto(true)'></input><br>");      
                    $("#lblActive").append("<label style='width:200px'>ID main function:</label><select id='GotoWhere' onChange='updateGoto(true)'></option><br>");      
                    //listMain = [];
                    nameMain(nodeParameters);
                    for(var key in listMain){
                        $("#GotoWhere").append("<option name="+listMain[key]+" value="+listMain[key]+">Goto ID "+listMain[key]+"</option>")
                    }
                    value = data.node.data.where ;
                    $("#GotoWhere option[value='"+value+"']").prop('selected', true);
                   
                   $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>This function allows you to go to a particular place in the experimental protocol. Please note, you can only jump to the first functions, i.e. the first children of your protocol, not the sub-children.</fielset>");
                    
                }
                if(data.node.type==='STOP'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    $("#lblActiveName").append("<fieldset><legend><small>Edit stop: "+value+"</small></fieldset>");
                    
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='STOPTitle' onChange='updateSTOP(true)'></input><br>");      
                    $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>This node is used to stop the current protocol.</fielset>");
                    
                }
                
                 if(data.node.type==='XYZ'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    $("#lblActiveName").append("<fieldset><legend><small>Edit position: "+value+"</small></fieldset>");
                   $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='XYZTitle' onChange='updateXYZ(true)'></input><br>");      
                    
                    value = data.node.data.channel ;
                    $("#lblActive").append("<label style='width:200px'>Channel:</label><select id='XYZChannel' onChange='updateXYZ(true)'><option name=Not used value='Not used'>Not used</option><option name=1 value='1'>1</option><option name=2 value='2'>2</option><option name=3 value='3'>3</option><option name=4 value='4'>4</option><option name=5 value='5'>5</option></select><br>");                      
                    $("#XYZChannel option[value='"+value+"']").prop('selected', true);
                  
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    value = data.node.data.xPosition ;
                    $("#lblActive").append("<label style='width:200px'>Position X:</label><input readonly min='1' step='1' value=" + value + " type = 'number' id='XYZxPosition' onChange='updateXYZ(true)'></input><br>");      
                    nameType = nameType + '| x['+value/50+'µm]' ;
                    value = data.node.data.yPosition ;
                    $("#lblActive").append("<label style='width:200px'>Position Y:</label><input readonly min='1' step='1' value=" + value + " type = 'number' id='XYZyPosition' onChange='updateXYZ(true)'></input><br>");      
                    nameType = nameType + '| y['+value/50+'µm]' ;
                    value = data.node.data.zPosition ;
                    $("#lblActive").append("<label style='width:200px'>Position Z:</label><input readonly min='1' step='1' value=" + value + " type = 'number' id='XYZzPosition' onChange='updateXYZ(true)'></input><br>");      
                    nameType = nameType + '| z['+value/100+'µm]' ;
                    
                    //value = data.node.data.skip ;
                    //$("#lblActive").append("<div id='skip'><hr><label style='width:200px'>Skip:</label><input min='0' step='1' value=" + value + " type = 'number' id='XYZSkip' onChange='updateXYZ()'></input></div>");      
                    //$("#skip").hide();
                    
                    
                    checked = '';
                    if(data.node.data.exp){checked = 'checked';}
                    $("#lblActive").append("<div id='XYZSkipDiv0'><label style='width:200px'>Skip</label><input name='XYZType1' " + checked + " type = 'radio' id='XYZSkip' onClick='updateXYZ(true)'></input><div id='XYZSkipDiv'></div></div>");
                    value = data.node.data.skip ;
                    $("#XYZSkipDiv").append("<small><label style='width:200px; text-align:center'>Modulo frequency</label><input min='1' step='1' value='"+ value +"' type = 'number' id='XYZSkipparam' onChange='updateXYZ(true)'></input><br></small>");
                    $("#XYZSkipDiv").hide() ; //nameType = nameType + ' | skip['+nodeParameters.data.skip+']' ;  
                    checked = '';
                    if(!data.node.data.exp){checked = 'checked';}
                    $("#lblActive").append("<div id='XYZListDiv0'><label style='width:200px'>List</label><input name='XYZType1' " + checked + " type = 'radio' id='XYZList' onClick='updateXYZ(true)'></input><div id='XYZListDiv'></div></div>");
                    value = data.node.data.list ;
                    $("#XYZListDiv").append("<small><label style='width:200px; text-align:center'>Time list</label><input value='"+ value +"' type = 'text' id='XYZListparam' onChange='updateXYZ(true)'></input><br></small>");
                    $("#XYZListDiv").hide() ;
                    $('#XYZSkipDiv0').hide();
                    $('#XYZListDiv0').hide();
                    
                    if(verifyParent(nodeParameters)){
                        $('#XYZSkipDiv0').show();
                        $('#XYZListDiv0').show();
                        //ici juste l'activer ou non
                        if(checked==''){
                            $('#XYZSkipDiv').show();
                            $('#XYZListDiv').hide();
                        } else {
                            $('#XYZSkipDiv').hide();
                            $('#XYZListDiv').show();
                        }
 
                    }
                    $("#lblActive").append("<label style='width:200px'>Mark and replace position:</label><button onClick='generatedNumber()'><img src='icons/yxz-512.png'></img></button><br>");      
                    $("#lblActive").append("<label style='width:200px'>Go to position:</label><button onClick='showNumber()'><img src='icons/arrow_right.png'></img></button><br>");      
                    //nodeParameters.setTitle(nameType);
                    //console.log(nodeParameters.key);
                     $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>Channel: you can associate the position with a microfluidic channel. <Br> <br> Skip: this parameter is only valid when a position is in a sequence. It allows you to ignore iterations. For example, if you enter a modulo frequency at 3, you will perform the functions associated with your position once in 3. <br> <br> List: this parameter is only valid when a position is in a sequence. It allows you to play a specific time list based on your location settings. For example, if you have a repetition number of 10, a repetition time of 1 min (in your sequence) and a list 1-3-5-6 (in your position). The program will only perform the functions associated with your position at 1min, 3min, 5min and 6min hours. <br> <br> You can also mix the 'skip' and 'list' parameters of a group of positions - positions.");
                    
                }
                if(data.node.type==='µFluidic'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    $("#lblActive").append("<hr><label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='UFTitle' onChange='updateUF()'></input>");      
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    $("#lblActive").append("<hr><label style='width:200px'>Valve1:</label><select id='UFValve1' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");      
                    $("#lblActive").append("<hr><label style='width:200px'>Valve2:</label><select id='UFValve2' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");      
                    $("#lblActive").append("<hr><label style='width:200px'>Valve3:</label><select id='UFValve3' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");      
                    $("#lblActive").append("<hr><label style='width:200px'>Valve4:</label><select id='UFValve4' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");      
                    $("#lblActive").append("<hr><label style='width:200px'>Valve5:</label><select id='UFValve5' onChange='updateUF()'><option name=OFF value=0>OFF</option><option name=ON value=1>ON</option></select>");      
                    value = data.node.data.v1 ;
                    $("#UFValve1 option[value='"+value+"']").prop('selected', true);
                    value = data.node.data.v2 ;
                    $("#UFValve2 option[value='"+value+"']").prop('selected', true);
                    value = data.node.data.v3 ;
                    $("#UFValve3 option[value='"+value+"']").prop('selected', true);
                    value = data.node.data.v4 ;
                    $("#UFValve4 option[value='"+value+"']").prop('selected', true);
                    value = data.node.data.v5 ;
                    $("#UFValve5 option[value='"+value+"']").prop('selected', true);
                    
                    nameType = nameType + '| state[' + $('#UFValve1').find('option:selected').attr("name")+'-'+$('#UFValve2').find('option:selected').attr("name")+'-'+$('#UFValve3').find('option:selected').attr("name")+'-'+$('#UFValve4').find('option:selected').attr("name")+'-'+$('#UFValve5').find('option:selected').attr("name")+']' ;
                    
                   // nodeParameters.setTitle(nameType);
                }


                if(data.node.type==='GROUP'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    $("#lblActiveName").append("<fieldset><legend><small>Edit group of positions: "+nameType+"</small></fieldset>");
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='GroupTitle' onChange='updateGroup(true)'></input><br>");      
                    
                     value = data.node.data.channel ;
                    $("#lblActive").append("<label style='width:200px'>Channel:</label><select id='GroupChannel' onChange='updateGroup(true)'><option name=Not used value='Not used'>Not used</option><option name=1 value='1'>1</option><option name=2 value='2'>2</option><option name=3 value='3'>3</option><option name=4 value='4'>4</option><option name=5 value='5'>5</option></select><br>");                      
                    $("#GroupChannel option[value='"+value+"']").prop('selected', true);
                  
                    //value = data.node.data.skip ;
                    //$("#lblActive").append("<div id='skip'><hr><label style='width:200px'>Skip:</label><input min='0' step='1' value=" + value + " type = 'number' id='GroupSkip' onChange='updateGroup()'></input></div>");      
                    //$("#skip").hide();
                    checked = '';
                    if(data.node.data.exp){checked = 'checked';}
                    $("#lblActive").append("<div id='GroupSkipDiv0'><label style='width:200px'>Skip</label><input name='GroupType1' " + checked + " type = 'radio' id='GroupSkip' onClick='updateGroup(true)'></input><div id='GroupSkipDiv'></div></div>");
                    value = data.node.data.skip ;
                    $("#GroupSkipDiv").append("<small><label style='width:200px; text-align:center;'>Modulo frequency</label><input min='1' step='1' value='"+ value +"' type = 'number' id='GroupSkipparam' onChange='updateGroup(true)'></input><br></small>");
                    $("#GroupSkipDiv").hide() ; //nameType = nameType + ' | skip['+nodeParameters.data.skip+']' ;  
                    checked = '';
                    if(!data.node.data.exp){checked = 'checked';}
                    $("#lblActive").append("<div id='GroupListDiv0'><label style='width:200px'>List</label><input name='GroupType1' " + checked + " type = 'radio' id='GroupList' onClick='updateGroup(true)'></input><div id='GroupListDiv'></div></div>");
                    value = data.node.data.list ;
                    $("#GroupListDiv").append("<small><label style='width:200px; text-align:center'>Time list</label><input value='"+ value +"' type = 'text' id='GroupListparam' onChange='updateGroup(true)'></input><br></small>");
                    $("#GroupListDiv").hide() ;
                    $('#GroupSkipDiv0').hide();
                    $('#GroupListDiv0').hide();
                    
                    if(verifyParent(nodeParameters)){
                        $('#GroupSkipDiv0').show();
                        $('#GroupListDiv0').show();
                        //ici juste l'activer ou non
                        if(checked==''){
                            $('#GroupSkipDiv').show();
                            $('#GroupListDiv').hide();
                        } else {
                            $('#GroupSkipDiv').hide();
                            $('#GroupListDiv').show();
                        }
                      }
                      $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>A position group is used to group a set of positions (position list node) and to perform a number of functions at all of these positions.<br><br>Channel: you can associate the position group with a microfluidic channel.<br><br>Skip: this parameter is only valid when a group of positions is in a sequence and allows you to ignore iterations. For example, if you enter a modulo frequency at 3, you will perform once in 3 the functions present in your position group. <br> <br> List: this parameter is only valid when a group of positions is in a sequence. It allows you to play a specific time list according to the parameters of your position group. For example, if you have a repetition number of 10, a repetition time of 1 min (in your sequence) and a list 1-3-5-6 (in your position group). The program will only perform the functions associated with your position group at 1min, 3min, 5min and 6min hours. <br> <br>");
                    
                   // nodeParameters.setTitle(nameType);
                }
                          
                if(data.node.type==='LOOP'){
                    $('#lblActiveEsttimatedTime').empty();
                    value = data.node.title ;
                    try{
                        value = value.split('|');
                        value = value[0]
                    }catch{
                        value = value;
                    }
                    $("#lblActiveName").empty();
                    $("#lblActiveName").append("<fieldset><legend><small>Edit sequence: "+value+"</small></fieldset>");
                    
                    $("#lblActive").append("<label style='width:200px'>Title:</label><input value=" + value + " type = 'text' id='LoopTitle' onChange='updateLoop(true)'></input><br>");      
                    var nameType = '' ;
                    nameType = nameType + value ;  
                    value = data.node.data.repeat ;
                    estimatedTime =  value ;
                    $("#lblActive").append("<label style='width:200px'>Number of repeat:</label><input min='1' step='1' value=" + value + " type = 'number' id='LoopRepeat' onChange='updateLoop(true)'></input><br>");                      
                    nameType = nameType + '| '+ data.node.data.repeat+'x[';  
                    value = data.node.data.time ;
                    estimatedTime = estimatedTime *value ;
                    $("#lblActive").append("<label style='width:200px'>Repeat time (min):</label><input min='1' step='1' value=" + value + " type = 'number' id='LoopTime' onChange='updateLoop(true)'></input><br>");      
                    nameType = nameType + data.node.data.time+'min]';  
                    
                    
                    
                    checked = '';
                    if(data.node.data.exp){checked = 'checked';}
                    $("#lblActive").append("<div id='LoopSkipDiv0'><label style='width:200px'>Skip</label><input name='LoopType1' " + checked + " type = 'radio' id='LoopSkip' onClick='updateLoop(true)'></input><div id='LoopSkipDiv'></div></div>");
                    value = data.node.data.skip ;
                    $("#LoopSkipDiv").append("<small><label style='width:200px; text-align: center;'>Modulo frequency</label><input min='1' step='1' value='"+ value +"' type = 'number' id='LoopSkipparam' onChange='updateLoop(true)'></input><br></small>");
                    $("#LoopSkipDiv").hide() ; //nameType = nameType + ' | skip['+nodeParameters.data.skip+']' ;  
                    $('#LoopSkipDiv0').hide();
                    //nameType = nameType + ' | skip['+nodeParameters.data.skip+']' ;  
                    
                    checked = '';
                    if(!data.node.data.exp){checked = 'checked';}
                    $("#lblActive").append("<div id='LoopListDiv0'><label style='width:200px'>List</label><input name='LoopType1' " + checked + " type = 'radio' id='LoopList' onClick='updateLoop(true)'></input><div id='LoopListDiv'></div></div>");
                    value = data.node.data.list ;
                    $("#LoopListDiv").append("<small><label style='width:200px; text-align: center;'>Time list</label><input value='"+ value +"' type = 'text' id='LoopListparam' onChange='updateLoop(true)'></input><br></small>");
                    $("#LoopListDiv").hide() ; //nameType = nameType + ' | skip['+nodeParameters.data.skip+']' ;  
                    $('#LoopListDiv0').hide();
                    //nameType = nameType + ' | skip['+nodeParameters.data.skip+']' ;  
                      
                    if(verifyParent(nodeParameters)){
                        $('#LoopSkipDiv0').show();
                        $('#LoopListDiv0').show();
                        //ici juste l'activer ou non
                        if(checked==''){
                            $('#LoopSkipDiv').show();
                            $('#LoopListDiv').hide();
                        } else {
                            $('#LoopSkipDiv').hide();
                            $('#LoopListDiv').show();
                        }
                    }
                    ////LIST PAS DE ; mais des - sinon JSON PLANTE
                    
                    checked ='';
                    if(data.node.data.extend) {checked = 'checked';nameType = nameType + ' | extend[Yes]';}
                    else {nameType = nameType + ' | extend[No]';}
                    $("#lblActive").append("<label style='width:200px'>Extend the loop time</label><input " + checked + " type = 'checkbox' id='LoopExtend' onClick='updateLoop(true)'></input><br>");
                    
                    checked ='';
                    if(data.node.data.wait) {checked = 'checked';nameType = nameType + ' | wait[Yes]';}
                    else {nameType = nameType + ' | wait[No]';}
                    $("#lblActive").append("<label style='width:200px'>Wait the end of loop </label><input " + checked + " type = 'checkbox' id='LoopWait' onClick='updateLoop(true)'></input><br>");

                    estimatedTimeD1 = parseInt(estimatedTime / 1440) ;
                    estimatedTimeD2 = (estimatedTime % 1440) ;
                    estimatedTimeH1 = parseInt(estimatedTimeD2 / 60) ;
                    estimatedTimeH2 = (estimatedTimeD2 % 60) ;
                    estimatedTimeM1 = parseInt(estimatedTimeH2) ;
                    estimatedTimeS1 = parseInt(estimatedTimeM1 / 60) ;
                    //$("#lblActiveEsttimatedTime").append("<hr><label style='width:200px'>Estimated total time:</label><label>"+estimatedTimeD1+' day - '+estimatedTimeH1+' hours - '+estimatedTimeM1+' min. - '+estimatedTimeS1+" sec.</label>");                      
                    //nodeParameters.setTitle(nameType);
                    //console.log(data.node.key);
                    //data.node.key = data.node.getIndexHier();
                    //console.log(data.node.key);
                    $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>Skip : this parameter is only valid when a sequence is in a sequence. This parameter lets you skip iterations. For example, if you enter a modulo frequency at 3, you will perform once in 3 the functions present in your sequence.<br><br>List :  this parameter is only valid when a sequence is in a sequence. This parameter allows you to play a specific time list according to the parameters of your sequence. For example, if you have a repetition number of 10, a repetition time of 1min and a list 1-3-5-6. The program will only perform the functions associated with your sequence at time 1min, 3min, 5min and 6min.<br><br>Extend the loop time : this parameter allows you to extend the time of your sequence if the total duration of the associated functions exceeds the repetition time<br><br> Wait the end of loop : not yet available</fieldset>");
                    // $("#lblActive").append("<br><br><fieldset><legend><small><img src='icons/help.png'/>&nbsp;Note:</small></legend>Extend the loop time : this parameter allows you to extend the time of your sequence if the total duration of the associated functions exceeds the repetition time<br>");
                    
                }
            },
        dnd5: {
            preventVoidMoves: true,
            preventRecursiveMoves: true,
            autoExpandMS: 400,
            dragStart: function(node, data) {
                return true;
            },
            dragEnd: function(node, data) {
                console.log('end');
                console.log(node) ;
                if(node.type==='GROUP') updateGroup(false);
                if(node.type==='XYZ') updateXYZ(false);
                if(node.type==='LOOP') updateLoop(false);
                if(node.type==='BREAK') updateBreak(false);
                if(node.type==='Goto') updateGoto(false);
                },
            dragEnter: function(node, data) {
                data.dataTransfer.dropEffect = "move";
                return true;
            },
            dragOver: function(node, data) {
            data.dataTransfer.dropEffect = "move";
            },
            dragLeave: function(node, data) {
                console.log('E');
            },
            dragDrop: function(node, data) {
                var transfer = data.dataTransfer;
                node.debug("drop", data);
                //nodeParameters.key = 10000000000000000 ; 
                
                //if(node.type==='GROUP') updateGroup();
                //console.log('DROP');
                if(node.type==='LIST'){
                    if(nodeParameters.key === node.key) updateList1();
                    else updateList2(node.key);    
                }
                if( data.otherNode ) {
                    var sameTree = (data.otherNode.tree === data.tree);
                    data.otherNode.moveTo(node, data.hitMode);
                }
                else if( data.otherNodeData ) {
                node.addChild(data.otherNodeData, data.hitMode);//.setActive();        
                }
                else {
                    var typeOfNode = '';
                    if(transfer.getData("text")=='Simple picture')      typeOfNode = 'CAMERA' ;
                    else if(transfer.getData("text")=='Autofocus')      typeOfNode = 'AF' ;
                    else if(transfer.getData("text")=='Z-stack')        typeOfNode = 'ZS' ;
                    else if(transfer.getData("text")=='Imaging')        typeOfNode = 'Imaging' ;
                    else if(transfer.getData("text")=='Sequence')       typeOfNode = 'LOOP' ;
                    else if(transfer.getData("text")=='Group Position') typeOfNode = 'GROUP' ;
                    else if(transfer.getData("text")=='List Position')  typeOfNode = 'LIST' ;
                    else if(transfer.getData("text")=='XYZ Position')   typeOfNode = 'XYZ' ;
                    else if(transfer.getData("text")=='Mosaic')         typeOfNode = 'Mosaic' ;
                    else if(transfer.getData("text")=='Delay')          typeOfNode = 'Delay' ;
                    else if(transfer.getData("text")=='Slack')          typeOfNode = 'Slack' ;
                    else if(transfer.getData("text")=='µFluidic')       typeOfNode = "µFluidic";
                    else if(transfer.getData("text")=='IF')             typeOfNode = "IF";
                    else if(transfer.getData("text")=='STOP')             typeOfNode = "STOP";
                    else if(transfer.getData("text")=='BREAK')             typeOfNode = "BREAK";
                    else if(transfer.getData("text")=='Analysis')       typeOfNode = "Analysis";
                    else if(transfer.getData("text")=='Goto')       typeOfNode = "Goto";
                    else {typeOfNode = "LIGHT";}
                    
                    if(typeOfNode==="GROUP"){
                        var obj = [
                            { title: transfer.getData("text"),
                                type: typeOfNode,
                                skip:1,
                                list : '1-2-3',
                                exp : true,
                                channel : 'Not used',
                                /*children: [
                                { title: "List of positions", type: "LIST" }
                                ]*/
                            }
                            ];
                        node.addChildren(obj).setActive();
                    }
                    if(typeOfNode==="LIST"){
                        var obj = [
                                { title: 'List of positions',
                                    type: typeOfNode,
                                }
                            ];
                        node.addChildren(obj).setActive();
                    }if(typeOfNode==="PROT"){
                    node.addNode({
                        title: transfer.getData("text"),
                        comment : 'this is a comment !',
                        exp : 'MicroFluidic',
                        microscope : 'MissMarple',
                        date : '2020-04-10',
                        folder : 'MIC0006',
                        author : 'WilliamsB',
                        prefixe : 'img',
                        type : typeOfNode
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="CAMERA"){
                    node.addNode({
                        title: transfer.getData("text"),
                        time : 100,
                        skip : 0,
                        number : 1,
                        zoffset : 0,
                        type : typeOfNode
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="STOP"){
                        node.addNode({
                            title: transfer.getData("text"),
                            type : typeOfNode
                            }, data.hitMode).setActive();  
                        }
                    if(typeOfNode==="BREAK"){
                        node.addNode({
                            title: 'Break',
                            where: '',
                            type : typeOfNode
                            }, data.hitMode).setActive();  
                        }
                    if(typeOfNode==="AF"){
                    node.addNode({
                        title: transfer.getData("text"),
                        "lower" : 30,
                        "upper": 30,
                        "aftbl" : "LCPlanFl 40x",
                        type : typeOfNode
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="ZS"){
                    node.addNode({
                        title: transfer.getData("text"),
                        "skip" : 0,
                        "zstart": -5,
                        "zend" : 5,
                        "zstep" : 1,
                        "shutter" : true,
                        type : typeOfNode
                        }, data.hitMode).setActive();
                    }
                    if(typeOfNode==="LIGHT"){
                        node.addNode({
                        title: transfer.getData("text"),
                        time : 10,
                        skip : 0,
                        wheel : 1,
                        color : "#22EE33",
                        title2: transfer.getData("text"),
                        type : typeOfNode
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="Mosaic"){
                        node.addNode({
                        title: transfer.getData("text"),
                        image : "",
                        type : typeOfNode
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="LOOP"){
                        node.addNode({
                        title: "Sequence",
                        time: 6,
                        repeat: 10,
                        extend: false,
                        wait : true,
                        skip: 1,
                        list : '1-2-3',
                        exp : true,
                        type : typeOfNode
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="Delay"){
                        node.addNode({
                        title: "Delay",
                        time: "1",
                        type : typeOfNode
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="Imaging"){
                        node.addNode({
                        title: "Imaging",
                        type : typeOfNode,
                        autofocus: false,
                        lower: globalParam[1],
                        upper: globalParam[2],
                        offset : globalParam[3],
                        zPosition : 897653,
                        aftbl: globalParam[0],
                        picture : true,
                        zstack : false,
                        zstart: -5,
                        zend: 5,
                        zstep: 1,
                        shutter: true,
                        mosaic : false,
                        mask : '',
                        settingchannels : 'RFP',
                        timeexposure : 200,
                        skip : 2
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="Slack"){
                        node.addNode({
                        title: "Slack",
                        type : 0,
                        message : "",
                        type : typeOfNode,
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="Goto"){
                        node.addNode({
                        title: "Goto",
                        where : "",
                        type : typeOfNode,
                        }, data.hitMode).setActive();  
                    }if(typeOfNode==="Analysis"){
                        node.addNode({
                        title: "Analysis",
                        definedAlgo : true,
                        definedAlgoName : 0,
                        definedAlgoComment : ['The algorthim calculte the number of the cell in RFP','UNET Algorithm'],
                        ownAlgoNameId : 0,
                        ownAlgo : false,
                        ownAlgoName : [],
                        ownAlgoComment : [],
                        type : typeOfNode,
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="µFluidic"){
                        node.addNode({
                        title: "µFluidic",
                        v1: 'OFF',
                        v2: 'OFF',
                        v3: 'OFF',
                        v4: 'OFF',
                        v5: 'OFF',
                        type : typeOfNode,
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="IF"){
                        node.addNode({
                        title: "IF",
                        condition: "",
                        formatedCondition: "",
                        time : true,
                        type : typeOfNode,
                        }, data.hitMode).setActive();  
                    }
                    if(typeOfNode==="XYZ"){
                        node.addNode({
                            title: "Position",
                            xPosition : 0,
                            yPosition : 0,
                            zPosition : 0,
                            skip: 1,
                            list : '1-2-3',
                            exp : true,
                            channel : 'Not Used',
                            type : typeOfNode,
                            }, data.hitMode).setActive();  
                        }
                    }
                node.setExpanded();
                }
            },
            table: {
                indentation: 20,
                nodeColumnIdx: 2,
                checkboxColumnIdx: 0
            },
            gridnav: {
                autofocusInput: true,
                handleCursorKeys: true
            },
            createNode: function(event, data) {
                var node = data.node,
                $tdList = $(node.tr).find(">td");
            
            },
            renderColumns: function(event, data) {
                var node = data.node;
                if(initKey){
                    $tdList = $(node.tr).find(">td");
                    console.log('ini');
                    $tdList.find("input").val(node.key);
                    $tdList.eq(1).text(node.key);
                    if(node.key>=replaceKey) replaceKey = parseInt(node.key)+1;
                    setTimeout(function(){
                        initKey = false;
                    },2000);
                }
                else {
                   try{
                        $tdList = $(node.tr).find(">td");
                        console.log('add');
                        if((node.key).search('_') != -1){
                            node.key = replaceKey;
                            $tdList.find("input").val(node.key);
                            $tdList.eq(1).text(node.key);
                            replaceKey = replaceKey + 1;
                        }
                    }
                    catch(e){
                        console.log('exept');
                    }
                }
            }
        }).on("nodeCommand", function(event, data){
            var refNode, moveMode,
            tree = $(this).fancytree("getTree"),
            node = tree.getActiveNode();
        
            switch( data.cmd ) {
                /*case "moveUp":
                    refNode = node.getPrevSibling();
                    if( refNode ) {
                        node.moveTo(refNode, "before");
                        node.setActive();
                    }
                    break;
                case "moveDown":
                    refNode = node.getNextSibling();
                    if( refNode ) {
                        node.moveTo(refNode, "after");
                        node.setActive();
                        }
                    break;
                */
                case "indent":
                    refNode = node.getPrevSibling();
                    if( refNode ) {
                        console.log(node.type);
                        node.moveTo(refNode, "child");
                        refNode.setExpanded();
                        if(node.type==='XYZ') updateXYZ(false);
                        if(node.type==='GROUP') updateGroup(false);
                        if(node.type==='LOOP') updateLoop(false);
                        if(node.type==='BREAK') updateBreak(false);
                        if(node.type==='Goto') updateGoto(false);
                    }
                    break;
                case "outdent":
                        node.moveTo(node.getParent(), "after");
                        if(node.type==='XYZ') updateXYZ(false);
                        if(node.type==='GROUP') updateGroup(false);
                        if(node.type==='LOOP') updateLoop(false);
                        if(node.type==='BREAK') updateBreak(false);
                        if(node.type==='Goto') updateGoto(false);
                        
                    //   }
                    //}
                    break;
                case "rename":
                    node.editStart();
                    break;
                case "remove":
                    refNode = node.getNextSibling() || node.getPrevSibling() || node.getParent();
                    if((node.getParent().type==='LIST')&&(node.type==='XYZ')){
                        updateList0(node.getParent().key,-1,false);
                    }
                    node.remove();
                    if( refNode ) {
                        refNode.setActive();
                    }
                    break;
                case "addChild":
                    node.editCreateNode("child", "");
                    break;
                case "addSibling":
                    node.editCreateNode("after", "");
                    break;
                case "cut":
                    CLIPBOARD = {mode: data.cmd, data: node};
                    break;
                case "copy":
                    CLIPBOARD = {
                        mode: data.cmd,
                        data: node.toDict(function(n){
                            delete n.key;
                        })
                    };
                    break;
                case "clear":
                    CLIPBOARD = null;
                    break;
                case "paste":
                    //nodeParameters.key = 10000000000000000 ;
                   // modifyKey([CLIPBOARD.data]);
                    //console.log($.ui.fancytree.getTree("#tree"))
                    if( CLIPBOARD.mode === "cut" ) {
                        CLIPBOARD.data.moveTo(node, "child");
                    } else if( CLIPBOARD.mode === "copy" ) {
                        if(node.type==='LOOP') updateLoop(false);
                        if(node.type==='LIST'){
                            //console.log(nodeParameters.key+' '+node.key);
                            if(nodeParameters.key === node.key) updateList2();
                            else updateList1(node.key);    
                        }
                        if(node.type==='XYZ'){
                            node.getParent().addChildren(CLIPBOARD.data).setActive();
                            updateList0(node.getParent().key,0,false);
                        }
                        else if(node.type==='Imaging')node.getParent().addChildren(CLIPBOARD.data).setActive();
                        else node.addChildren(CLIPBOARD.data).setActive();
                    }
                    break;
                default:
                    alert("Unhandled command: " + data.cmd);
                    return;
            }
    
        }).on("click", function(e){
     
        }).on("keydown", function(e){
            var cmd = null;
            // console.log(e.type, $.ui.fancytree.eventToString(e));
            switch( $.ui.fancytree.eventToString(e) ) {
                case "ctrl+shift+b":
                    cmd = "addChild";
                    break;
                case "ctrl+b":
                    cmd = "addSibling";
                    break;
                case "meta+shift+n": // mac: cmd+shift+n
                    cmd = "addChild";
                    break;
                case "ctrl+c":
                case "meta+c": // mac
                    cmd = "copy";
                    break;
                case "ctrl+v":
                case "meta+v": // mac
                    cmd = "paste";
                    break;
                case "ctrl+x":
                case "meta+x": // mac
                    cmd = "cut";
                    break;
                case "ctrl+n":
                case "meta+n": // mac
                    cmd = "addSibling";
                    break;
                case "del":
                case "meta+backspace": // mac
                    cmd = "remove";
                    break;
                case "dblclick":
                    cmd = "rename";
                    break;
                case "f2":  // already triggered by ext-edit pluging
                    cmd = "rename";
                    break;
                case "ctrl+up":
                    cmd = "moveUp";
                    break;
                case "ctrl+down":
                    cmd = "moveDown";
                    break;
                case "ctrl+right":
                case "ctrl+shift+right": // mac
                    cmd = "indent";
                    break;
                case "ctrl+left":
                case "ctrl+shift+left": // mac
                    cmd = "outdent";
                }
                if( cmd ){
                $(this).trigger("nodeCommand", {cmd: cmd});
                // e.preventDefault();
                // e.stopPropagation();
                return false;
                }
            });
        $("#tree").contextmenu({
            delegate: "span.fancytree-node",
            menu: [
            {title: "Edit <kbd>[F2]</kbd>", cmd: "rename", uiIcon: "ui-icon-pencil" },
            {title: "Delete <kbd>[Del]</kbd>", cmd: "remove", uiIcon: "ui-icon-trash" },
            {title: "----"},
            {title: "New sibling <kbd>[Ctrl+B]</kbd>", cmd: "addSibling", uiIcon: "ui-icon-plus" },
            {title: "New child <kbd>[Ctrl+Shift+B]</kbd>", cmd: "addChild", uiIcon: "ui-icon-arrowreturn-1-e" },
            {title: "----"},
            {title: "Cut <kbd>Ctrl+X</kbd>", cmd: "cut", uiIcon: "ui-icon-scissors"},
            {title: "Copy <kbd>Ctrl-C</kbd>", cmd: "copy", uiIcon: "ui-icon-copy"},
            {title: "Paste as child<kbd>Ctrl+V</kbd>", cmd: "paste", uiIcon: "ui-icon-clipboard", disabled: true }
            ],
            beforeOpen: function(event, ui) {
            var node = $.ui.fancytree.getNode(ui.target);
            $("#tree").contextmenu("enableEntry", "paste", !!CLIPBOARD);
            node.setActive();
            },
            select: function(event, ui) {
            var that = this;
            setTimeout(function(){
                $(that).trigger("nodeCommand", {cmd: ui.cmd});
            }, 100);
            }
        });
    });
    function getNbChildren(obj){
        return obj.length ;
    } 
    function getRandomInt(max){
        return Math.floor(Math.random()*Math.floor(max));
    }
    
    
    function existsKey(obj){
        //console.log(obj);
            var repeat = getNbChildren(obj); //nbre d'enfants
            //console.log(repeat);
            while(repeat > 0){
                var childrenN = obj[getNbChildren(obj)-repeat] ; //on récupère l'enfant courant de la boucle d'occurence
                childrenN.key = getRandomInt(1000);
                if(childrenN.hasOwnProperty('children')) modifyKey(childrenN.children);
                repeat--;
            }
    }
    var idupdateAnalysis = 0 ;
    function updateAnalysis2(){
        console.log($('#AnalysisOwnAlgos').find(":selected").val());
        console.log($('#AnalysisOwnAlgoComment').val());
        nodeParameters.data.ownAlgoComment[$('#AnalysisOwnAlgos').find(":selected").val()] = $('#AnalysisOwnAlgoComment').val();
    }


    $(function() {
        $('.map').maphilight();
        $('#squidheadlink').mouseover(function(e) {
            $('#squidhead').mouseover();
        }).mouseout(function(e) {
            $('#squidhead').mouseout();
        }).click(function(e) { e.preventDefault(); });
    });
        var position = {
            '1':{x:0,y:0},'2':{x:0,y:0},'3':{x:0,y:0},'4':{x:0,y:0},'5':{x:0,y:0},
            '6':{x:0,y:0},'7':{x:0,y:0},'8':{x:0,y:0},'9':{x:0,y:0},'10':{x:0,y:0},
            '11':{x:0,y:0},'12':{x:0,y:0},'13':{x:0,y:0},'14':{x:0,y:0},'15':{x:0,y:0},
            '16':{x:0,y:0},'17':{x:0,y:0},'18':{x:0,y:0},'19':{x:0,y:0},'20':{x:0,y:0},
            '21':{x:0,y:0},'22':{x:0,y:0},'23':{x:0,y:0},'24':{x:0,y:0},'25':{x:0,y:0}
        }
    
        var stepX1 = 0 ; var stepX2 = 0 ; var stepY1 = 0 ; var stepY2 = 0 ; 
        var enabled = false ;
    
        function updateRes1(){
            globalParam[4] = $(".res1").val();
        }
        function updateRes2(){
            globalParam[5] = $(".res2").val();
        }
        function updateRes3(){
            globalParam[6] = $(".res3").val();
        }
        function updateRes4(){
            globalParam[7] = $(".res4").val();
        }
        function updateRes10(){
            globalParam[4] = $(".res10").val();
        }
        function updateRes20(){
            globalParam[5] = $(".res20").val();
        }
        function updateRes30(){
            globalParam[6] = $(".res30").val();
        }
        function updateRes40(){
            globalParam[7] = $(".res40").val();
        }
        function updateTimeExp0(){
            globalParam[9] = $(".timeExp0").val();        
        }
        function updateTimeExp(){
            globalParam[9] = $(".timeExp").val();        
        }
        function updateTemp0(){
            globalParam[10] = $(".temp0").val();
        }
        function updateTemp(){
            globalParam[10] = $(".temp").val();
        }
        function updateGain0(){
            globalParam[11] = $(".gain0").val();
        }
        function updateGain(){
            globalParam[11] = $(".gain").val();
        }
        function updateStart0(){
            globalParam[16] = $(".start0").val();
        }
        function updateStart(){
            globalParam[16] = $(".start").val();
        }
        function updateStop0(){
            globalParam[17] = $(".stop0").val();
        }
        function updateStop(){
            globalParam[17] = $(".stop").val();
        }
        function updateStep0(){
            globalParam[18] = $(".step0").val();
        }
        function updateStep(){
            globalParam[18] = $(".step").val();
        }
        function updateAftbl0(){
            globalParam[0] = $( ".aftbl0 option:selected" ).text(); 
        }
        function updateAftbl(){
            globalParam[0] = $( ".aftbl option:selected" ).text(); 
        }
        function updateInvert0(){
            globalParam[12] = $( "#posInvert0 option:selected" ).text(); 
        }
        function updateInvert(){
            globalParam[12] = $( "#posInvert option:selected" ).text(); 
        }
        function updateMap0(){
            globalParam[13] = $( "#posMap0 option:selected" ).text(); 
        }
        function updateMap(){
            globalParam[13] = $( "#posMap option:selected" ).text(); 
        }
        function updateBC0(){
            globalParam[14] = $( "#posBC0 option:selected" ).text(); 
        }
        function updateBC(){
            globalParam[14] = $( "#posBC option:selected" ).text(); 
        }
        function updateSC0(){
            globalParam[15] = $( "#posSC0 option:selected" ).text(); 
        }
        function updateSC(){
            globalParam[15] = $( "#posSC option:selected" ).text(); 
        }
        
        
        function calculPosition(){
            stepX1 =  position['2'].x - position['1'].x
            stepX2 =  position['6'].x - position['1'].x
            stepY1 =  position['2'].y - position['1'].y
            stepY2 =  position['6'].y - position['1'].y
            var id = 1 ;
            for(var j=0;j<=4;j++){
                for(var i=1;i<=5;i++){
                    position[String(id)].x = position['1'].x + (i-1)*stepX1 + (j)*stepX2 ; 
                    position[String(id)].y = position['1'].y + (i-1)*stepY1 + (j)*stepY2 ;
                    id = id + 1;
                }
            }
            $("#designMove0").empty();
            $("#designMove0").append("<select id='designMoveSelect0' onchange='goToPos0();'><select>");
            $("#designMoveSelect0").append("<option value='0'><i>Select position</i></option>");
            for(var i=1;i<=25;i++)$("#designMoveSelect0").append("<option value="+String(i)+">Position "+String(i)+"</option>");
            enabled = true ;
        }
        function goToPos0(){
            if($("#designMoveSelect0").val()!==0){  
                alert('x='+position[String($("#designMoveSelect0").val())].x+'; y='+position[String($("#designMoveSelect0").val())].y);
                globalParam[8] = $("#designMoveSelect0").val() ;
            }
        }
        function goToPos(){
            if($("#designMoveSelect").val()!==0){
                alert('x='+position[String($("#designMoveSelect").val())].x+'; y='+position[String($("#designMoveSelect").val())].y);
                globalParam[8] = $("#designMoveSelect").val() ;
                alert($("#designMoveSelect").val());
            }
        }
    
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
        function update(num){
            if((num==1)||(num==2)||(num==6)){
                var x = getRandomInt(1000000) ; 
                //$("#x"+num).val(x);
                position[String(num)].x = x;
                var y = getRandomInt(1000000) ; 
                //$("#y"+num).val(y);
                position[String(num)].y = y;
                if((position['1'].x!=0)&&(position['1'].y!=0)&&(position['2'].x!=0)&&(position['2'].y!=0)&&(position['6'].x!=0)&&(position['6'].y!=0)){
                    calculPosition();
                }
            }
        }
    
        function visibilite(num){
            if((position['1'].x!=0)&&(position['1'].y!=0)&&(position['2'].x!=0)&&(position['2'].y!=0)&&(position['6'].x!=0)&&(position['6'].y!=0)){
                if(confirm('Move to room '+num+' ?')){
                    alert('x='+position[String(num)].x+'; y='+position[String(num)].y);
                }
            } else {
                alert('You must define the position 1, 2 and 6 !');
            }
        }
        function info(num){
            $('#room').empty();
            $('#room').append("<h4>Room"+num+"</h4><hr>");            
            $('#room').append("<label style='width:150px'> Position x : </label><input id='x"+num+" style='width:150px' type='number'value='"+position[String(num)].x+"' </input><br>");            
            $('#room').append("<label style='width:150px'> Position y : </label><input id='y"+num+" style='width:150px' type='number' value='"+position[String(num)].y+"' </input>");            
            if((num==1)||(num==2)||(num==6)) $('#room').append("<br><label style='width:150px'>       Mark : </label><button  style='width:150px' onclick='update("+num+");' >Mark the position</button>");
        
        }

    function generatedNumber(){
        var x = getRandomInt(100000); var y = getRandomInt(100000); var z = getRandomInt(100000);
        $("#XYZxPosition").val(x) ; $("#XYZyPosition").val(y) ; $("#XYZzPosition").val(z) ;
        alert("Create : virtual position, x="+ x +", y="+ y+", z="+ z) ;
        //console.log(nodeParameters.data);
        nodeParameters.data.xPosition = x ; nodeParameters.data.yPosition = y ; nodeParameters.data.zPosition = z;
    }
    function showNumber(){
        var x = $("#XYZxPosition").val(); var y = $("#XYZyPosition").val(); var z = $("#XYZzPosition").val();
        alert("Go to virtual position, x="+ x +", y="+ y+", z="+ z)
        
    }
    function updateAnalysis(activate){
        var nameType = '';
        nodeParameters.title =  $('#AnalysisTitle').val().replace(/ /gi, '_');
        //if($('#AnalysisDefinedAlgo').is(":checked")){nodeParameters.data.definedAlgo = true; }
        //else{nodeParameters.data.definedAlgo = false;}
        if(nodeParameters.data.definedAlgo){            
        //    $("#AnalysisDefinedAlgoDiv").show();            
        //    $("#AnalysisOwnAlgoDiv").hide();            
        //    $("#AnalysisOwnAlgoDiv0").hide();            
            nodeParameters.data.definedAlgoName = $('#AnalysisDefinedAlgos').find(":selected").val();                                 
            value = nodeParameters.data.definedAlgoComment[$('#AnalysisDefinedAlgos').find(":selected").val()] ;
            $("#AnanysisDefinedAlgoComment").val(value);
        //    nameType = nameType + '| algorithm['+$('#AnalysisDefinedAlgos').find('option:selected').attr("name")+']' ;
        }
        //if($('#AnalysisOwnAlgo').is(":checked")){nodeParameters.data.ownAlgo = true; }
        //else {nodeParameters.data.ownAlgo = false;}
        /*if(nodeParameters.data.ownAlgo){            
            $("#AnalysisDefinedAlgoDiv").hide();            
            $("#AnalysisOwnAlgoDiv").show();            
            
            value = nodeParameters.data.ownAlgoComment[$('#AnalysisOwnAlgos').find(":selected").val()] ;
            $("#AnalysisOwnAlgoDiv").val(value);
            nameType = nameType + '| algorithm['+$('#AnalysisOwnAlgos').find('option:selected').attr("name")+']' ;
            
            var lg = $('#AnalysisOwnAlgos option').map(function() { return $(this).val(); }).get().length;

            console.log(nodeParameters.data);
            if(($('#AnalysisOwnAlgoFile').val()!=='')&&(nodeParameters.data.ownAlgoName.includes($('#AnalysisOwnAlgoFile').val()) === false)){
                nodeParameters.data.ownAlgoName.push($('#AnalysisOwnAlgoFile').val());
                $('#AnalysisOwnAlgos').append('<option name='+$('#AnalysisOwnAlgoFile').val()+' value='+lg+'>'+$('#AnalysisOwnAlgoFile').val()+'</option>');
                $('#AnalysisOwnAlgos option[value="'+lg+'"]').prop('selected', true);
                nodeParameters.data.ownAlgoComment.push($('#AnalysisOwnAlgoComment').val());
            }
            if(nodeParameters.data.ownAlgoComment.length!==0) $("#AnalysisOwnAlgoDiv0").show();
            try {
                console.log(nodeParameters.data.ownAlgoComment[$('#AnalysisOwnAlgos').find(":selected").val()]);
                $('#AnalysisOwnAlgoComment').val(nodeParameters.data.ownAlgoComment[$('#AnalysisOwnAlgos').find(":selected").val()]);                                 
            } catch{
                console.log('impossible');
            }            

        }*/
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $('#AnalysisTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        //$("#lblActiveName").append("Edit analysis:  " + nodeParameters.title);
        
         $("#lblActiveName").append("<fieldset><legend><small>Edit anlysis: "+ nodeParameters.title+"</small></fieldset>");
         
    }

    function updateProt(activate){
        var nameType = '';

        nodeParameters.title =  $('#ProtTitle').val().replace(/ /gi, '_');
        nodeParameters.data.comment =  $('#ProtComment').val();
        nodeParameters.data.prefixe =  $('#ProtPrefixe').val();
        nodeParameters.data.folder =  $('#ProtFolder').val();
        nodeParameters.data.date =  $('#ProtDate').val();
        //nameType = nameType + '| folder['+nodeParameters.data.folder+']' ;
        nodeParameters.data.author = $('#ProtAuthor').find(":selected").attr("name");                                 
        nodeParameters.data.exp = $('#ProtType').find(":selected").attr("name");                                 
        nodeParameters.data.microscope = $('#ProtMic').find(":selected").attr("name");                                 
        nameType = nameType + ' | author['+$('#ProtAuthor').find('option:selected').attr("name")+']' ;
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]);
        $('#ProtTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        
         $("#lblActiveName").append("<fieldset><legend><small>Edit protocole: "+ nodeParameters.title+"</small></fieldset>");
                              
        //console.log(nodeParameters);
        //nodeParameters.key = 10000000000000000 ; 
              
    }

    function updateIf(activate){
        var nameType = '';
        nodeParameters.title =  $('#IfTitle').val().replace(/ /gi, '_');
        //console.log($('#IfCondition').val());
        nodeParameters.data.condition =  $('#IfCondition').val();
        //var f = $('#IfCondition').val().replace(/N_CELL/gi, '<b><span style="color: rgb(51, 102, 255)">N_CELL</span></b>').replace(/ITERATOR/gi, '<b><span style="color: rgb(51, 102, 255)">ITERATOR</span></b>').replace(/IMG_BLACK/gi, '<b><span style="color: rgb(51, 102, 255)">IMG_BLACK</span></b>').replace(/IMG_WHITE/gi, '<b><span style="color: rgb(51, 102, 255)">IMG_WHITE</span></b>').replace(/IMG_NOISE/gi, '<b><span style="color: rgb(51, 102, 255)">IMG_NOISE</span></b>');
        //for(var key in world) f = f.replaceAll(key, '<b><span style="color: rgb(0, 128, 0);">'+key+'</span></b>') ;
        //for(i=0;i<SC.length;i++) f = f.replaceAll(SC[i], '<b><span style="color: rgb(0, 128, 0);">'+SC[i]+'</span></b>') ;
        //nodeParameters.data.formatedCondition = '<b><span style="color: rgb(0, 0, 0)>IF </span></b>'+ f ;
        //console.log(eval(nodeParameters.data.condition ));
        //$("#IfFormatedCondition").html('<b><span style="color: rgb(0, 0, 0)">IF </span></b>'+f);
        var o = false ;
        for(var key in world){
            if (nodeParameters.data.condition.search(key)!==-1) {$("#"+key).show();o=true;}
            else {$("#"+key).hide();}
        }
        if(o) {$("#RESULT").show();}
        else {$("#RESULT").hide();}
       
        var f = nodeParameters.data.condition;
        f = f.replaceAll('ITERATOR', $("#IfITERATOR").val()).replaceAll('NCELL', $("#IfNCELL").val()).replaceAll('IMG_BLACK', $('#IfIMG_BLACK').find(":selected").val()).replaceAll('IMG_NOISE', $('#IfIMG_NOISE').find(":selected").val()).replaceAll('IMG_WHITE', $('#IfIMG_WHITE').find(":selected").val()) ;
        try {var r = eval(f) ;$("#IfResult").val(r); $("#IfResult").css("background","green");}
        catch(e){ $("#IfResult").val('SyntaxError: Unexpected end of script'); $("#IfResult").css("background","red");}
        
        if($('#IfTime').is(":checked")){nameType = nameType + ' | extend[Yes]'; nodeParameters.data.time = true;}
        else {nameType = nameType + ' | extend[No]'; nodeParameters.data.time = false;}

        
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $('#ProtTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        $("#lblActiveName").append("<fieldset><legend><small>Edit condition if: "+nodeParameters.title+"</small></fieldset>");
                  
    }

    function updateUF(activate){
        var nameType = '';
        nodeParameters.title =  $('#UFTitle').val().replace(/ /gi, '_');
        nodeParameters.data.v1 = $('#UFValve1').find(":selected").val();                                 
        nodeParameters.data.v2 = $('#UFValve2').find(":selected").val();                                 
        nodeParameters.data.v3 = $('#UFValve3').find(":selected").val();                                 
        nodeParameters.data.v4 = $('#UFValve4').find(":selected").val();                                 
        nodeParameters.data.v5 = $('#UFValve5').find(":selected").val();                                 
        nameType = nameType + '| state[' + $('#UFValve1').find('option:selected').attr("name")+'-'+$('#UFValve2').find('option:selected').attr("name")+'-'+$('#UFValve3').find('option:selected').attr("name")+'-'+$('#UFValve4').find('option:selected').attr("name")+'-'+$('#UFValve5').find('option:selected').attr("name")+']' ;
         
       // nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $('#UFTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        $("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        
    }

    function updateSlack(activate){
        var nameType = '';
        nodeParameters.title =  $('#SlackTitle').val().replace(/ /gi, '_');
        nodeParameters.data.type = $('#SlackType').find(":selected").val();                                 
        nameType = nameType + ' | type['+$('#SlackType').find('option:selected').attr("name")+']' ;
        nodeParameters.data.message =  $('#SlackMessage').val();

        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $('#ProtTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
//        $("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        $("#lblActiveName").append("<fieldset><legend><small>Edit delay: "+nodeParameters.title+"</small></fieldset>");
        
    }
    function updateSTOP(activate){
        var nameType = '';
        nodeParameters.title =  $('#STOPTitle').val().replace(/ /gi, '_');
        if(activate)nodeParameters.setTitle(nodeParameters.title);
        $('#ProtTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
//        $("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        $("#lblActiveName").append("<fieldset><legend><small>Edit stop: "+nodeParameters.title+"</small></fieldset>");
        
    }
    function updateDelay(activate){
        var nameType = '';
        nodeParameters.title =  $('#DelayTitle').val().replace(/ /gi, '_');
        nodeParameters.data.time =  $('#DelayTime').val();
        nameType = nameType + '| time['+nodeParameters.data.time+'sec]' ;
        
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $('#DelayTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        $("#lblActiveName").append("<fieldset><legend><small>Edit delay: "+nodeParameters.title+"</small></fieldset>");
               
    }
    function updateGroup(activate){
        var nameType = '' ;
        nodeParameters.title =  $('#GroupTitle').val().replace(/ /gi, '_');
        
        nodeParameters.data.channel = $('#GroupChannel').find(":selected").attr("name");
        
        try {
            var nbChildren = nodeParameters.children[0].children.length ;
            if(nbChildren>0) {
               for(var i=0;i<nbChildren;i++)  nodeParameters.children[0].children[i].data.channel = nodeParameters.data.channel;
            }
        }
        catch(e){
            console.log('no position in group !');
        }
        if($('#GroupSkip').is(":checked")){nodeParameters.data.exp = true; }
        else{nodeParameters.data.exp = false;}
        
        if(verifyParent(nodeParameters)){
            nodeParameters.data.skip = $('#GroupSkipparam').val();
            nodeParameters.data.list = $('#GroupListparam').val(); 
            $("#GroupSkipDiv0").show();
            $("#GroupListDiv0").show();
             
            if(nodeParameters.data.exp){
                $("#GroupSkipDiv").show();
                $("#GroupListDiv").hide();
             } else {
                $("#GroupSkipDiv").hide();
                $("#GroupListDiv").show();
             }
        } else {
            $("#GroupSkipDiv0").hide();
            $("#GroupListDiv0").hide();
        }

        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $('#DelayTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        $("#lblActiveName").append("<fieldset><legend><small>Edit group of positions: "+nodeParameters.title+"</small></fieldset>");
        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        
    }
    function updateList(activate){
        var nameType = '' ;
        nodeParameters.title =  $('#ListTitle').val().replace(/ /gi, '_');
        if(nodeParameters.children==null){
            value = 0;
        } else {
            value = nodeParameters.children.length;
        }

        nameType =  nameType + '| positions['+value+']'
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $("#lblActiveName").empty();
        $("#lblActiveName").append("<fieldset><legend><small>Edit list of positions: "+nodeParameters.title+"</small></fieldset>");

        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        
    }
    function updateList1(){
        var nameType = '' ;
        nodeParameters.title =  $('#ListTitle').val().replace(/ /gi, '_');
        if(nodeParameters.children==null){
            value = 0;
        } else {
            value = nodeParameters.children.length+1;
            $("#ListnPos").val(value);      
        }

        nameType =  nameType + '| positions['+value+']'
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        $("#lblActiveName").append("<fieldset><legend><small>Edit list of positions: "+nodeParameters.title+"</small></fieldset>");
        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        
    }
    function updateList2(id){
        $("#tree").fancytree("getTree").activateKey(id);
        var nameType = '' ;
        nodeParameters.title =  $('#ListTitle').val().replace(/ /gi, '_');
        if(nodeParameters.children==null){
            value = 0;
        } else {
            value = nodeParameters.children.length+1;
            $("#ListnPos").val(value);      
        }

        nameType =  nameType + '| positions['+value+']'
       // nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        $("#lblActiveName").append("<fieldset><legend><small>Edit list of positions: "+nodeParameters.title+"</small></fieldset>");
        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
    }
    function updateList3(id){
        $("#tree").fancytree("getTree").activateKey(id);
        var nameType = '' ;
        nodeParameters.title =  $('#ListTitle').val().replace(/ /gi, '_');
        if(nodeParameters.children==null){
            value = 0;
        } else {
            value = nodeParameters.children.length-1;
            $("#ListnPos").val(value);      
        }
        nameType =  nameType + '| positions['+value+']'
       // nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        $("#lblActiveName").append("<fieldset><legend><small>Edit list of positions: "+nodeParameters.title+"</small></fieldset>");
        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
    }
    function updateList0(id,offset,form){
        var value = 0;
        var nameType = '' ;
        nodeParameters = $("#tree").fancytree("getTree").getNodeByKey(id);
        if(nodeParameters.children!=null){
            value = nodeParameters.children.length + offset;
        }
        nameType =  nameType + '| positions['+value+']'
      //  nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);   
       //nodeParameters.setTitle(nodeParameters.title.split('|')[0]);   
    }
    function updateBreak(activate){
        console.log('updateLoop');
        var nameType = '';
        nodeParameters.title =  $('#BreakTitle').val().replace(/ /gi, '_');
        console.log(nodeParameters.title);
        listLoop = [];
        nameLoop(nodeParameters);
        console.log(listLoop);

        nodeParameters.data.where = $('#BreakWhere').find(":selected").val();
        $("#BreakWhere").empty();
        var exists = false ;
        for(var key in listLoop){
            $("#BreakWhere").append("<option name="+listLoop[key]+" value="+listLoop[key]+">Break Loop ID "+listLoop[key]+"</option>")
            if(nodeParameters.data.where === listLoop[key]) exists = true ;
        }
        console.log(exists);
        //value = nodeParameters.data.where ;
        if(exists===false){
            $("#BreakWhere option[value='"+listLoop[0]+"']").prop('selected', true);
            nodeParameters.data.where = listLoop[0] ;
        } else $("#BreakWhere option[value='"+nodeParameters.data.where+"']").prop('selected', true);
        if(listLoop.length===0) nodeParameters.data.where ="";
                                        
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $('#BreakTitle').val(nodeParameters.title);
        $("#lblActiveName").empty();
//        $("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        $("#lblActiveName").append("<fieldset><legend><small>Edit break: "+nodeParameters.title+"</small></fieldset>");
         }
    function updateGoto(activate){
        var nameType = '';
        nodeParameters.title =  $('#GotoTitle').val().replace(/ /gi, '_');
        nameMain(nodeParameters);
        
        nodeParameters.data.where = $('#GotoWhere').find(":selected").val();
        $("#GotoWhere").empty();
        var exists = false ;
        for(var key in listMain){
            if(nodeParameters.key != listMain[key]) $("#GotoWhere").append("<option name="+listMain[key]+" value="+listMain[key]+">Goto ID "+listMain[key]+"</option>")
            if(nodeParameters.data.where === listMain[key]) exists = true ;
        }
        console.log(exists);
        //value = nodeParameters.data.where ;
        if(exists===false){
            $("#GotoWhere option[value='"+listMaain[0]+"']").prop('selected', true);
            nodeParameters.data.where = listMain[0] ;
        } else $("#GotoWhere option[value='"+nodeParameters.data.where+"']").prop('selected', true);
        if(listMain.length===0) nodeParameters.data.where ="";
                                        
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $('#GotoTitle').val(nodeParameters.title);
        $("#lblActiveName").empty();
//        $("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        $("#lblActiveName").append("<fieldset><legend><small>Edit goto: "+nodeParameters.title+"</small></fieldset>");
         }
    function updateXYZ(activate){
        var nameType = '';
        console.log(nodeParameters);
        nodeParameters.title =  $('#XYZTitle').val().replace(/ /gi, '_');
        nodeParameters.data.xPosition =  $('#XYZxPosition').val();
        //nameType = nameType + '| x['+nodeParameters.data.xPosition/50+'µm]' ;
        nodeParameters.data.yPosition =  $('#XYZyPosition').val();
        //nameType = nameType + '| y['+nodeParameters.data.yPosition/50+'µm]' ;
        nodeParameters.data.zPosition =  $('#XYZzPosition').val();
        //nameType = nameType + '| z['+nodeParameters.data.zPosition/100+'µm]' ;
        
        //console.log($('#XYZChannel').find(":selected").attr("name"));
        nodeParameters.data.channel = $('#XYZChannel').find(":selected").attr("name");
        
        if($('#XYZSkip').is(":checked")){nodeParameters.data.exp = true; }
        else{nodeParameters.data.exp = false;}
        
        //console.log('verif'+verifyParent(nodeParameters));
        if(verifyParent(nodeParameters)){
            nodeParameters.data.skip = $('#XYZSkipparam').val();
            nodeParameters.data.list = $('#XYZListparam').val(); 
            $("#XYZSkipDiv0").show();
            $("#XYZListDiv0").show();
             
            if(nodeParameters.data.exp){
                $("#XYZSkipDiv").show();
                $("#XYZListDiv").hide();
             } else {
                $("#XYZSkipDiv").hide();
                $("#XYZListDiv").show();
             }

        } else {
            $("#XYZSkipDiv0").hide();
            $("#XYZListDiv0").hide();
        }
        //console.log(activate);
        if(activate) nodeParameters.setTitle(nodeParameters.title);
        $('#XYZTitle').val(nodeParameters.title);
        $("#lblActiveName").empty();
        $("#lblActiveName").append("<fieldset><legend><small>Edit position: "+nodeParameters.title+"</small></fieldset>");
        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        
    }
    var outputVerifyParent = false ;
    function verifyParent(obj){
        outputVerifyParent = false ;
        try {
            var r = obj.getParent() ;
            console.log(r);
            if(r.type == 'LOOP') {outputVerifyParent = true ;}
            else verifyParent(r);
        }
        catch{
            //console.log('not children');
            return outputVerifyParent ;
        }
        return outputVerifyParent ;
    }
    function nameMain(){
        listMain = [] ;
        var tree = $("#tree").fancytree("getTree");
        var d = tree.toDict(true);
        //console.log(d.children[0].children);
        for(var key in d.children[0].children) listMain.push(String(d.children[0].children[key].key));
        console.log(listMain);
    }
    
    function nameLoop(obj){        
        try {
            var r = obj.getParent() ;
            if(r.type == 'LOOP') {listLoop.push(String(r.key)) ; nameLoop(r);}
            else nameLoop(r);
        }
        catch{
            return listLoop ;
        }
        return listLoop ;
    }
    
    function updateLoop(activate){
        var nameType = '';
        nodeParameters.title =  $('#LoopTitle').val().replace(/ /gi, '_');
        $('#LoopTitle').val(nodeParameters.title);
        nodeParameters.data.repeat =  $('#LoopRepeat').val();
        //nameType = nameType + '| '+nodeParameters.data.repeat+'x [' ;
        nodeParameters.data.time =  $('#LoopTime').val();
        //nameType = nameType + nodeParameters.data.time+'min]' ;
        
        //console.log($('#LoopSkip').is(":checked"));
        if($('#LoopSkip').is(":checked")){nodeParameters.data.exp = true; }
        else{nodeParameters.data.exp = false;}
        
        nodeParameters.data.skip = $('#LoopSkipparam').val();
        //console.log($('#LoopListparam').val());
        nodeParameters.data.list = $('#LoopListparam').val(); 
        
        /*if(nodeParameters.data.exp){
            $("#LoopSkipDiv").show();
            $("#LoopListDiv").hide();
         } else {
            $("#LoopSkipDiv").hide();
            $("#LoopListDiv").show();
         }*/
         if(verifyParent(nodeParameters)){
            nodeParameters.data.skip = $('#LoopSkipparam').val();
            nodeParameters.data.list = $('#LoopListparam').val(); 
            $("#LoopSkipDiv0").show();
            $("#LoopListDiv0").show();
             
            if(nodeParameters.data.exp){
                $("#LoopSkipDiv").show();
                $("#LoopListDiv").hide();
             } else {
                $("#LoopSkipDiv").hide();
                $("#LoopListDiv").show();
             }

        } else {
            $("#LoopSkipDiv0").hide();
            $("#LoopListDiv0").hide();
        }

        
        $("#lblActiveEsttimatedTime").empty();
        estimatedTime = parseInt($('#LoopTime').val()) * parseInt($('#LoopRepeat').val());
        //console.log(estimatedTime);
        estimatedTimeD1 = parseInt(estimatedTime / 1440) ;
        estimatedTimeD2 = (estimatedTime % 1440) ;
        estimatedTimeH1 = parseInt(estimatedTimeD2 / 60) ;
        estimatedTimeH2 = (estimatedTimeD2 % 60) ;
        estimatedTimeM1 = parseInt(estimatedTimeH2) ;
        estimatedTimeS1 = parseInt(estimatedTimeM1 / 60) ;
        //$("#lblActiveEsttimatedTime").append("<hr><label style='width:200px'>Estimated time of the loop:</label><label>"+estimatedTimeD1+' day - '+estimatedTimeH1+' hours - '+estimatedTimeM1+' min. - '+estimatedTimeS1+" sec.</label>");                      

        if($('#LoopExtend').is(":checked")){nameType = nameType + ' | extend[Yes]'; nodeParameters.data.extend = true;}
        else {nameType = nameType + ' | extend[No]'; nodeParameters.data.extend = false;}

        if($('#LoopWait').is(":checked")){nameType = nameType + ' | wait[Yes]'; nodeParameters.data.wait = true;}
        else {nameType = nameType + ' | wait[No]'; nodeParameters.data.wait = false;}

        if(activate) nodeParameters.setTitle(nodeParameters.title);
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]);
        $('#LoopTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        //$("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        $("#lblActiveName").append("<fieldset><legend><small>Edit sequence: "+nodeParameters.title+"</small></fieldset>");
                    
    }

    function updateImaging(){
        var nameType = '';
        if($('#ImagingAutofocus').is(":checked")){nameType = nameType + '| AF'; nodeParameters.data.autofocus = true;}
        else nodeParameters.data.autofocus = false;
        nodeParameters.data.aftbl = $("#ImagingAutofocusObjective").val() ;
        nodeParameters.data.lower = $("#ImagingAutofocusLower").val() ;
        nodeParameters.data.upper = $("#ImagingAutofocusUpper").val() ;
        nodeParameters.data.zPosition = $("#ImagingAutofocusZPosition").val()*100 ;
        nodeParameters.data.offset = $("#ImagingAutofocusOffset").val()*100 ;

        if(nodeParameters.data.autofocus){
            $("#ImagingAutofocusDiv").show();
        } else $("#ImagingAutofocusDiv").hide();

        if($('#ImagingPicture').is(":checked")){nameType = nameType + '| img'; nodeParameters.data.picture = true; }
        else{nodeParameters.data.picture = false;}

        if($('#ImagingZstack').is(":checked")){nameType = nameType + '| zs';nodeParameters.data.zstack = true;}
        else nodeParameters.data.zstack = false ; 

        nodeParameters.data.zstart = $("#ImagingZstackzstart").val() ;
        nodeParameters.data.zend = $("#ImagingZstackzstop").val() ;
        nodeParameters.data.zstep = $("#ImagingZstackstep").val() ;
        if(nodeParameters.data.zstack){            
            $("#ImagingZstackDiv").show();
        } else $("#ImagingZstackDiv").hide();

        nodeParameters.data.settingchannels =  $('#ImagingSettingChannels').find('option:selected').attr("name")
        nameType = nameType + '['+nodeParameters.data.settingchannels+':';

        nodeParameters.data.timeexposure =  $('#ImagingTimeexposure').val();
        nameType = nameType + nodeParameters.data.timeexposure+'ms]';

        if($('#ImagingMosaic').is(":checked")){nodeParameters.data.mosaic = true; nameType = nameType + '| M';}
        else nodeParameters.data.mosaic = false ; 
        if(nodeParameters.data.mosaic){
            $("#ImagingMosaicDiv").show();
            nodeParameters.data.mask = mask ;
            //console.log(mask);
            order = 'mask' ;
            requestWS('mask,'+mask);
            $('#wPaint').wPaint('image', nodeParameters.data.mask);
        } else{                
            nodeParameters.data.mask = mask ;
            if(nodeParameters.data.mask == '') $('#wPaint').wPaint('clear');
            //else $('#wPaint').wPaint('image', nodeParameters.data.mask);
            $("#ImagingMosaicDiv").hide();
        } 

        nodeParameters.title =  $('#ImagingTitle').val().replace(/ /gi, '_');
      //  nodeParameters.setTitle(nodeParameters.title.split('|')[0]+nameType);
        //nodeParameters.setTitle(nodeParameters.title.split('|')[0]);
        $('#ImagingTitle').val(nodeParameters.title.split('|')[0]);
        $("#lblActiveName").empty();
        $("#lblActiveName").append("Edit function:  " + nodeParameters.title);
        }

            
    if (loc.protocol === "https:") { wsUri = "wss:"; }
        wsUri += "//" + loc.host + loc.pathname.replace("cyberscope","ws/cyberscope");

    function wsConnect() {
        ws = new WebSocket(wsUri);
        ws.onmessage = function(msg) {
            var  data = msg.data;
            if(order === 'mdaRunning'){
            //    console.log("Img:"+data);
              if (data !== 'MDA-START') $('#mdaL').append('<img width="256" height="192" src="media/'+data+'"/>');
              //order  = 'mdaRunning';
            }
            console.log(order);
            console.log(data);
 //           if(order!=='getRessources')
            try {
                data = JSON.parse(data);
                }
            catch{
                console.log('error init');
            }
            if(order === 'getRessources') {//ressources = data ;
                order = 'listConfigChannel'; requestWS(order); }
            else if(order === 'listConfigChannel') {
                //listConfigChannel = data ;
                //if(listConfigChannel.length !==0) {$("#available_configChannels").empty();$("#available_configChannels").append('<span>Available configuration channels | click to load a specific configuration channel</span>&nbsp;');}
                //for(var i=0; i<listConfigChannel.length;i++)
                //    $("#available_configChannels").append('<span name="'+listConfigChannel[i]+'" id="setting_button_load_channel_'+i+'" class="drag-source" draggable="true" ><img src="icons/wrench.png">&nbsp;'+listConfigChannel[i]+'</span>&nbsp;&nbsp;&nbsp;');
                order = 'listConfigMda';
                requestWS(order);
                }
            else if(order === 'listConfigMda') {
                //listConfigMda = data ;
                //if(listConfigMda.length !==0) {$("#available_configMda").empty();$("#available_configMda").append('<span>Available MDA configuration | click to load a specific MDA</span>&nbsp;<br>');}
                //for(var i=0; i<listConfigMda.length;i++)
                //    $("#available_configMda").append('<span name="'+listConfigMda[i]+'" id="setting_button_load_mda_'+i+'" class="drag-source" draggable="true"><img src="icons/protocol.png">&nbsp;'+listConfigMda[i]+'</span>&nbsp;&nbsp;&nbsp;');
                }
            else if( (order === 'getSettingChannels') || (order === 'LoadSettingChannelsConfiguration')) {settingschannels = data ; SettingChannels('load');}
            else if(order === 'LoadSettingMda'){
               $.ui.fancytree.getTree("#tree").reload(newSourceOption).done(function(){
                    order = 'LoadSettingChannelsConfiguration';
                    requestWS("LoadSettingChannelsConfiguration,"+newSourceOptionId);
                });
                setTimeout(function(){
                   $("#name_configChannels").empty();
                   $("#name_configChannels").append('<span>Configuration loaded: '+listConfigChannel[newSourceOptionId]+'</span>');
               },1000);
            }
            else if( (order === 'updateSettingChannels') ) {settingschannels = data ; makeSpanChannels();}
            else if(order === "getMDA-mdazs_zstart_set") {$("#mdazs_zstart").val(data);}
            else if(order=== 'getSettingChannels-MDA' ){settingschannels = data ; make();}
            else if(order=='getValueXYZ'){
                if(openBox === false){
                    openBox = true ;
                    $.confirm({
                        title: "Settings: "+nodeParameters.title,
                        theme: "modern",
                        content: 'url:form/xyz2.html',
                        boxWidth: '1350px',
                        useBootstrap: false,//
                        //columnClass: 'col-md-12',
                        onContentReady: function () {
                            var self = this;
                            if(nodeParameters.data.xPosition === 0) self.$content.find('.xPosition').val(data['xPosition']);
                            else self.$content.find('.xPosition').val(nodeParameters.data.xPosition);
                            if(nodeParameters.data.yPosition === 0) self.$content.find('.yPosition').val(data['yPosition']);
                            else self.$content.find('.yPosition').val(nodeParameters.data.yPosition);
                            if(nodeParameters.data.zPosition === 0) self.$content.find('.zPosition').val(data['zPosition']);
                            else self.$content.find('.zPosition').val(nodeParameters.data.zPosition);
                            self.$content.find('.res1').val(nodeParameters.data.res1);
                            self.$content.find('.res2').val(nodeParameters.data.res2);
                            ////MODIF 1
                            $("#posEnligth").empty();
                            $("#posEnligth").append("<select class='settings_select_channel' id='settings_select_channel'></select>");
                            $('#settings_select_channel').append("<option value='-1'>Turn everything off</option>");
                            for(var scan=1; scan<settingschannels.length;scan++){
                                $('#settings_select_channel').append("<option value=" + scan + ">" + settingschannels[scan]['name']  + "</option>");
                        
                            }
                        },
                        buttons: {
                            markorreplace: {
                                text: 'w', // text for button
                                btnClass: 'btn-green', // class for the button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function(markorreplace){
                                    order = 'getValueXYZ';
                                    requestWS('getValueXYZ');
                                    return false;
                                }
                            },
                            gotoposition: {
                                text: 'Go to position', // text for button
                                btnClass: 'btn-green', // class for the button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function(gotoposition){
                                    //order = 'getValueXYZ';
                                    requestWS('goToPosition,x='+this.$content.find(".xPosition").val()+',y='+this.$content.find(".yPosition").val()+',z='+this.$content.find(".zPosition").val());
                                    return false;
                                }
                            },
                            valid: {
                                btnClass: 'btn-blue',
                                action: function(){
                                    //, // class for the button
                                    var xPosition = this.$content.find('.xPosition').val();
                                    var yPosition = this.$content.find('.yPosition').val();
                                    var zPosition = this.$content.find('.zPosition').val();
                                    var res1 = this.$content.find('.res1').val();
                                    var res2 = this.$content.find('.res2').val();
                                    if(!xPosition){$.alert('provide a valid xPosition');return false;
                                    } else nodeParameters.data.xPosition = xPosition ;
                                    if(!yPosition){$.alert('provide a valid yPosition');return false;
                                    } else nodeParameters.data.yPosition= yPosition ;
                                    if(!zPosition){$.alert('provide a valid zPosition');return false;
                                    } else nodeParameters.data.zPosition = zPosition ;
                                    if(!res1){$.alert('provide a valid res1');return false;
                                    } else nodeParameters.data.res1 = res1 ;
                                    if(!res2){$.alert('provide a valid res2');return false;
                                    } else nodeParameters.data.res2 = res2 ;
                                    openBox = false ;
                                }
                            },
                            cancel:{
                                btnClass: 'btn-danger', // class for the button
                                action : function(){
                                    openBox = false ;
                                }
                            }
                        }
                    });
                }
                else for(var key in data) $('.'+key).val(data[key]);
            order = "";
            }
            //MODIF 1
            else if(order === 'tryAutoFocus'){
                if(data['state'] === 'SUCCESS'){
                    delta = parseFloat(parseFloat($(".zPosition").val()-data['autoFocus']));
                    $('.offset').val(delta);
//                    $('.status').val(data['state']);
                    $(".status").css("background","green");
                }
                else {
                    $('.offset').val(0);
//                    $('.status').val(data['state']);
                    $(".status").css("background","red");
                    
                }
            }
            //MODIF 1
            else if(order === 'getAutofocus'){
                
                $.confirm({
                    title: "Settings: "+nodeParameters.title,
                    theme: "modern",
                    content: 'url:form/af.html',
                    boxWidth: '1350px',
                    useBootstrap: false,//
                    buttons: {
                        tryit: {
                            text: 'Init Autfocus', // text for button
                            btnClass: 'btn-blue', // class for the button
                            //keys: ['enter', 'a'], // keyboard event for button
                            isHidden: false, // initially not hidden
                            isDisabled: false, // initially not disabled
                            action: function(tryitButton){
                                order = 'tryAutoFocus';
                                requestWS('tryAutoFocus,lower='+this.$content.find(".lower").val()+',upper='+this.$content.find(".upper").val()+',aftbl='+this.$content.find(".aftbl").val());
                                return false;
                            }
                        },
                        formSubmit: {
                            text: 'valid',
                            closeIcon : true,
                            btnClass: 'btn-green',
                            action: function () {
                                var zPosition = this.$content.find('.zPosition').val();
                                var offset = this.$content.find('.offset').val();
                                var upper = this.$content.find('.upper').val();
                                var lower = this.$content.find('.lower').val();
                                var aftbl = $('.aftbl').find(":selected").text(); //this.$content.find('.aftbl').val();
                                //alert();
                                if(!upper){$.alert('provide a valid upper');return false;
                                } else nodeParameters.data.upper = upper ;
                                if(!lower){$.alert('provide a valid lower');return false;
                                } else nodeParameters.data.lower = lower ;
                                nodeParameters.data.aftbl = aftbl;
                                nodeParameters.data.zPosition = zPosition;
                                nodeParameters.data.offset = offset;
                                if($('.option1').is(":checked")) nodeParameters.data.option1 = true ;
                                else  nodeParameters.data.option1 = false ;
                                if($('.option2').is(":checked")) nodeParameters.data.option2 = true ;
                                else  nodeParameters.data.option2 = false ;
                            }
                        },
                        cancel: {
                            text: 'cancel', // text for button
                            btnClass: 'btn-red', // class for the button
                            isHidden: false, // initially not hidden
                            isDisabled: false, // initially not disabled
                            action: function(cancel){
                                return true;
                            }
                        }
                
                    },
                    onContentReady: function () {
                        $("#posEnligth").empty();
                            $("#posEnligth").append("<select class='settings_select_channel' id='settings_select_channel'></select>");
                            $('#settings_select_channel').append("<option value='-1'>Turn everything off</option>");
                            for(var scan=1; scan<settingschannels.length;scan++){
                                $('#settings_select_channel').append("<option value=" + scan + ">" + settingschannels[scan]['name']  + "</option>");
                        
                            }
                        if(nodeParameters.data.option1 === true) $(".option1").prop('checked', true);
                        if(nodeParameters.data.option2 === true) $(".option2").prop('checked', true);
                        $(".aftbl option[name='"+nodeParameters.data.aftbl+"']").prop('selected', true);
                        $(".zPosition").val(data['zPosition']);
                        $(".lower").val(nodeParameters.data.lower);
                        $(".upper").val(nodeParameters.data.upper);
                        if(nodeParameters.data.zPosition !==0){
                    //        $(".zPosition").val(nodeParameters.data.zPosition);
                            $(".offset").val(nodeParameters.data.offset);
                        }
                        var jc = this;
                        this.$content.find('form').on('submit', function (e) {
                            e.preventDefault();
                            jc.$$formSubmit.trigger('click'); // reference the button and click it
                        });
                    }
                });

            }
        };
        ws.onopen = function() {
            document.getElementById('status').innerHTML = "Connected to server";
            mda();
            setTimeout(function(){
                requestWS('getRessources');
                //console.log("ZEROO");
            },500);
        };
        ws.onclose = function() {
            wait();
            //console.log("ZER");
            order = 'getRessources' ;
            nbOfSettingsChannels = -1 ;
            setTimeout(wsConnect,1000);
        };        
    }
    function requestWS(m) {
        if (ws) { ws.send(m);}
    }
    
    function live_mode(){
        $("#main").show();$("#live_mode").show();$("#settings").hide();$("#mda").hide();$("#wait").hide();$(".nav li").removeClass("active");$('#livemodeli').addClass('active');
        $.get( "http://127.0.0.1:5000/liveOn", function( data ) {
          $( ".result" ).html( data );
        });
    }
    
    function setting(){
        $("#main").show();$("#live_mode").hide();$("#calibration").hide();$("#settings").show();$("#mda").hide();$("#wait").hide();$(".nav li").removeClass("active");$('#settingschannelsli').addClass('active');
    }

    function mda(){
        $("#main").show(); $("#calibration").hide(); $("#live_mode").hide();$("#settings").hide();$("#mda").show();$("#wait").hide();$(".nav li").removeClass("active");$('#mdali').addClass('active');$('#mdatpli').addClass('active');$('#mdatpdiv').show();$('#mdampdiv').hide();$('#mdazsdiv').hide();$('#mdaafdiv').hide();$('#mdacdiv').hide();$('#mdaaodiv').hide();$('#mdasidiv').hide();$('#mdaacdiv').hide();
        loadGlobalParam();
        
        //alert(ref);
        /*$.get( "http://127.0.0.1:5000/quit", function( data ) {
          $( ".result" ).html( data );
          alert( "Load was performed." );
        });*/
    }
    function calibration(){
        $("#main").show();$("#calibration").show();$("#live_mode").hide();$("#settings").hide();$("#mda").hide();$("#wait").hide();$(".nav li").removeClass("active");$('#mdali').addClass('active');$('#mdatpli').addClass('active');$('#mdatpdiv').show();$('#mdampdiv').hide();$('#mdazsdiv').hide();$('#mdaafdiv').hide();$('#mdacdiv').hide();$('#mdaaodiv').hide();$('#mdasidiv').hide();$('#mdaacdiv').hide();
        loadGlobalParam();
        
    }
    function loadGlobalParam(){
        $(".offset").val(globalParam[3]);
        $(".res1").val(globalParam[4]);
        $(".res2").val(globalParam[5]);
        $(".res3").val(globalParam[6]);
        $(".res4").val(globalParam[7]);
        $(".res10").val(globalParam[4]);
        $(".res20").val(globalParam[5]);
        $(".res30").val(globalParam[6]);
        $(".res40").val(globalParam[7]);
        $(".timeExp").val(globalParam[9]);
        $(".timeExp0").val(globalParam[9]);
        $(".temp").val(globalParam[10]);
        $(".temp0").val(globalParam[10]);
        $(".gain").val(globalParam[11]);
        $(".gain0").val(globalParam[11]);
        $(".start").val(globalParam[16]);
        $(".start0").val(globalParam[16]);
        $(".stop").val(globalParam[17]);
        $(".stop0").val(globalParam[17]);
        $(".step").val(globalParam[18]);
        $(".step0").val(globalParam[18]);
        $(".aftbl option[name='"+globalParam[0]+"']").prop('selected', true);
        $(".aftbl0 option[name='"+globalParam[0]+"']").prop('selected', true);
        $("#posInvert option[value='"+globalParam[12]+"']").prop('selected', true);
        $("#posInvert0 option[value='"+globalParam[12]+"']").prop('selected', true);
        $("#posMap option[value='"+globalParam[13]+"']").prop('selected', true);
        $("#posMap0 option[value='"+globalParam[13]+"']").prop('selected', true);
        $("#posBC option[value='"+globalParam[14]+"']").prop('selected', true);
        $("#posBC0 option[value='"+globalParam[14]+"']").prop('selected', true);
        $("#posSC option[value='"+globalParam[15]+"']").prop('selected', true);
        $("#posSC0 option[value='"+globalParam[15]+"']").prop('selected', true);
        if(enabled){
            setTimeout(function(){
                $("#designMove").empty();
                $("#designMove0").empty();
                $("#designMove").append("<select id='designMoveSelect' onchange='goToPos();'><select>");
                $("#designMove0").append("<select id='designMoveSelect0' onchange='goToPos0();'><select>");
                $("#designMoveSelect").append("<option value='0'><i>Select position</i></option>");
                $("#designMoveSelect0").append("<option value='0'><i>Select position</i></option>");
                for(var i=1;i<=25;i++){ $("#designMoveSelect").append("<option value="+String(i)+">Position "+String(i)+"</option>"); $("#designMoveSelect0").append("<option value="+String(i)+">Position "+String(i)+"</option>");}
                try {
                    $("#designMoveSelect option[value='"+globalParam[8]+"']").prop('selected', true);
                    $("#designMoveSelect0 option[value='"+globalParam[8]+"']").prop('selected', true);
                }
                catch{
                    console.log('dont exits !');
                }                        
            },100);
        }
    }
    //obj, rannge-, range++,offset,res&, res2, res3, res4, position, time, t, gain, invert,color, bc, sc, start, stop, step, aftbl
    //var globalParam = ["LCPlanFl 40x" ,250,250,290,1,10,5,50, 5,100,20,1,'OFF','ON','ON','BF',-5,5,1,75]; 
        
    function wait(){
        $("#main").hide();
        $("#wait").show();
    }

    function SettingChannels(method){
        var data = settingschannels ;
        //alert(data[0]['name']);
        if(method == 'load'){
            $("#setting_table_channel").empty();
            for(var scan=1; scan<data.length;scan++){
                if(data[scan]['type'] == 'ligth-source'){
                    if(nbOfSettingsChannels  === -1) nbOfSettingsChannels  = 0 ;
                    nbOfSettingsChannels = nbOfSettingsChannels + 1 ;
                    $("#setting_table_channel").append('<table id="channel'+scan+'" class="table table-striped"></table>');
                    $("#channel"+scan).append("<thead><tr><th></th><th>Name Channel</th><th>Light Source</th><th style='width:500px;'></th><th></th><th></th><th></th><th></th></tr></thead>");
                    $("#channel"+scan).append("<tbody><tr><td id='chk"+scan+"'></td><td id='"+scan+"_name'></td><td id='option"+scan+"'></td><td id='config"+scan+"'></td><td id='delete"+scan+"'></td></tr></tbody>");
                    $("#"+scan+"_name").append("<input required name='"+scan+"_channel' id='"+scan+"_channel 'type='text' value='"+data[scan]['name']+"' placeholder='channel " + scan + "'/>");
                    $("#option"+scan).append("<select class='settings_select_device' name='"+scan+"_devices' id='"+scan+"_devices'></select>");
                    for(var i=0; i<ressources.length;i++) {
                        if(ressources[i]['type'] == 'ligth-source') $('#'+scan+'_devices').append("<option value=" + i + ">" + ressources[i]['device']  + "</option>");
                        if(ressources[i]['device'] === data[scan]['device']) $("#"+scan+"_devices option[value='"+i+"']").prop('selected', true);            
                    }
                //var inc = 0 ;
                for(var key in data[scan]["config"]) {
                    for(var element=0; element<data[scan]['config'][key].length;element++){
                        $("#config"+scan).append(data[scan]['config'][key][element].replace(/%/gi, scan+"_")+"&nbsp;");
                        if(data[scan]['config'][key][element].indexOf('select') !==-1){
                            $('#'+scan+"_"+key+element+" option[value='"+data[scan]['update'][key][element]+"']").prop('selected', true);}
                        if(data[scan]['config'][key][element].indexOf('number') !==-1){
                            $('#'+scan+"_"+key+element).val(data[scan]['update'][key][element]);            
                        }
                        //MODIF 1
                        //alert(data[scan]['config'][key][element]);
                        if(data[scan]['config'][key][element].indexOf('color') !==-1){
                            //alert("color:"+data[scan]['update'][key][element]);
                            $('#'+scan+"_"+key+element).val(data[scan]['update'][key][element]);
                            
                        }
                        }
                    $("#config"+scan).append("<br>");      
                }
                $("#delete"+scan).append("<button class='setting_button' name='settingchannels_del"+scan+"' id='settingchannels_del"+scan+"'><img src='icons/cross.png'></button>");
                }
            }
            order = '';
            if(nbOfSettingsChannels === -1) {$("#setting_button_save_channel").prop('disabled',true);}
            else { $("#setting_button_save_channel").prop('disabled',false); makeSpanChannels();}
            
        }
    }

  
    $(document).ready(function(){
        
        $(document).on('click', 'button', function () {
            if(this.id === 'mdazs_zstart_set') {order ="getMDA-mdazs_zstart_set" ; requestWS(order);} //
            if(this.id === 'xPosUP2') {requestWS('moveX,UP'+$(".res2").val());} //
            if(this.id === 'zPosUP2') {requestWS('moveZ,UP,'+$(".res2").val());} //
            if(this.id === 'xPosUP1') {requestWS('moveX,UP,'+$(".res1").val());} //
            if(this.id === 'zPosUP1') {requestWS('moveZ,F,'+$(".res1").val());} //
            if(this.id === 'xPosDW2') {requestWS('moveX,DW,'+$(".res2").val());} //
            if(this.id === 'zPosDW2') {requestWS('moveZ,DW,'+$(".res2").val());} //
            if(this.id === 'xPosDW1') {requestWS('moveX,DW,'+$(".res1").val());} //
            if(this.id === 'zPosDW1') {requestWS('moveZ,N,'+$(".res1").val());} //
            if(this.id === 'yPosLF2') {requestWS('moveY,LF,'+$(".res2").val());} //
            if(this.id === 'yPosLF1') {requestWS('moveY,LF,'+$(".res1").val());} //
            if(this.id === 'yPosRG2') {requestWS('moveY,RG,'+$(".res2").val());} //
            if(this.id === 'yPosRG1') {requestWS('moveY,RG,'+$(".res1").val());} //
            //alert("click");
        });

        $(document).on('click', 'li', function () {
            $(".nav li").removeClass("active");//this will remove the active class from  
            $('#'+this.id).addClass('active');
            $('#mdali').addClass('active');
            var div = this.id.replace(/li/gi,'div');
            $('#mdatpdiv').hide();$('#mdampdiv').hide();$('#mdazsdiv').hide();$('#mdaafdiv').hide();$('#mdacdiv').hide();$('#mdaaodiv').hide();$('#mdasidiv').hide();$('#mdaacdiv').hide();$('#'+div).show();
        });

        $("textarea").change(function(){
            if(this.id === 'mdaac_comment') requestWS("setMDAAcquisitioncommentComment="+$('#mdaac_comment').val());
        });

        $("input").change(function(){    
            if(this.id === 'mdatp_number') requestWS("setMDATimepointNumber="+$('#mdatp_number').val());
            if(this.id === 'mdatp_interval') requestWS("setMDATimepointInterval="+$('#mdatp_interval').val());
            if(this.id === 'mdazs_zstart') requestWS("setMDAZstacksZstart="+$('#mdazs_zstart').val());
            if(this.id === 'mdazs_zend') requestWS("setMDAZstacksZend="+$('#mdazs_zend').val());
            if(this.id === 'mdazs_zstep') requestWS("setMDAZstacksZstep="+$('#mdazs_zstep').val());
            if(this.id === 'mdaaf_skip') requestWS("setMDAAutofocusSkip="+$('#mdaaf_skip').val());
            if(this.id === 'mdasi_directory') requestWS("setMDASaveimagesDirectory="+$('#mdasi_directory').val());
            if(this.id === 'mdasi_prefix') requestWS("setMDASaveimagesPrefix="+$('#mdasi_prefix').val());
        });

        $("select").change(function(){
            if(this.id === 'mdatp_unity') requestWS("setMDATimepointUnity="+$('#mdatp_unity').val());
            if(this.id === 'mdazs_type') requestWS("setMDAZstacksType="+$('#mdazs_type').val());
            if(this.id === 'mdasi_format') requestWS("setMDASaveimagesFormat="+$('#mdasi_format').val());
        });

        $("input").click(function () {
            if(this.id === 'mdatp_use'){
                if($("#mdatp_use").is(":checked")){ $("#mdatp_param").show(); requestWS("setMDATimepointUse=1");}
                else { $("#mdatp_param").hide();requestWS("setMDATimepointUse=0");}
            }
            if(this.id === 'mdamp_use'){
                if($("#mdamp_use").is(":checked")){ $("#mdamp_param").show(); requestWS("setMDAMultiplespositionsUse=1");}
                else { $("#mdamp_param").hide();requestWS("setMDAMultiplespositionsUse=0");}
            }
            if(this.id === 'mdazs_use'){
                if($("#mdazs_use").is(":checked")){ $("#mdazs_param").show(); requestWS("setMDAZstacksUse=1");}
                else {$("#mdazs_param").hide();requestWS("setMDAZstacksUse=0");}
            }
            if(this.id === 'mdazs_shutter'){
                if($("#mdazs_shutter").is(":checked")){requestWS("setMDAZstacksShutter=1");}
                else {requestWS("setMDAZstacksShutter=0");}
            }
            if(this.id === 'mdaaf_use'){
                if($("#mdaaf_use").is(":checked")){$("#mdaaf_param").show(); requestWS("setMDAAutofocusUse=1");}
                else {$("#mdaaf_param").hide(); requestWS("setMDAAutofocusUse=0");}
            }
            if(this.id === 'mdac_use'){
                if($("#mdac_use").is(":checked")){ $("#mdac_param").show(); requestWS("setMDAChannelsUse=1");}
                else { $("#mdac_param").hide();requestWS("setMDAChannelsUse=0");}
            }
            
//            alert(this.id);
            
            if(this.id === 'mdasi_use'){
                if($("#mdasi_use").is(":checked")){$("#mdasi_param").show(); requestWS("setMDASaveimagesUse=1");}
                else {$("#mdasi_param").hide(); requestWS("setMDASaveimagesUse=0");}
            }
        });

        $("form[ajax=true]").submit(function(e) {        
            var id = $("form[ajax=true]").attr('id');
            e.preventDefault();       
            var form_data = $(this).serialize();
            if(id==='setting_channel_form') form_data = "topicpost=setting_channel_form&" + form_data ;
            var form_url = $(this).attr("action");
            var form_method = $(this).attr("method").toUpperCase();
            $.ajax({
                url: form_url, 
                type: form_method,      
                data: form_data,     
                cache: false,
                success: function(returnhtml){                          
                    alertmessage("<strong>Well done ! </strong>"+returnhtml,'#alert-success');
                    //alert();
                    order = 'LoadSettingChannelsConfiguration';
                    requestWS(order+",0");
                    //makeSpanChannels();
                /*
                &nbsp;<span class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', 'Channel 2');"><img src='icons/color_wheel.png'>&nbsp;Channel 2</span>
                &nbsp;<span class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', 'Channel 3');"><img src='icons/color_wheel.png'>&nbsp;Channel 3</span>
                &nbsp;<span class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', 'Channel 4');"><img src='icons/color_wheel.png'>&nbsp;Channel 4</span>
                  */          
                }           
            });    
        });    

    $(document).on('click', '.mda_channel_add', function () {
      order = 'getSettingChannels-MDA' ;
      requestWS(order);
    });



    });

    function makeSpanChannels(){
        var data  = settingschannels;
        $("#available_channels_mda").empty();
        $("#available_channels_mda").append('<span>Available channels | drag and drop directly on the tree</span><br>');
        //alert(data[1]['name']);
        for(var i=1; i<data.length; i++)
            $("#available_channels_mda").append('<span class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\', \''+data[i]['name']+'\');"><img src="icons/color_wheel.png">&nbsp;'+data[i]['name']+'</span>&nbsp;&nbsp;&nbsp;');
//            $("#available_channels_mda").append('<span onCLick="showInfo();" class="drag-source" draggable="true" ondragstart="event.dataTransfer.setData("text/plain", "ee");"><img src="icons/color_wheel.png">&nbsp;'+data[i]['name']+'</span>&nbsp;&nbsp;&nbsp;');
            
    }
/*    function showInfo(){
        alert("E"+settingsChannels);
 //       alert(settingsChannels);
        $.confirm({
          // theme: "material",
          title: "Settings :",
          //content: "<div id='tree'></div>",
          content: "<h1>INFO</h1>",
          escape: true,
          useBootstrap: true,
          boxWidth: 500,
        });
    }
*/
    //configuration channel MDA 
    var entete = false ;
    function make(){
        var data = settingschannels ;
        if(data.length===0) {alert("ATTENTION GO TO SETTING CHANNEL");}
        else {
            nbOfMdaConfiguration = nbOfMdaConfiguration + 1 ;
            var id = nbOfMdaConfiguration ;  
            if(entete === false) {
                $("#mdac_param").append("<table id='mdac_param_table' class='table table-striped'></table>"); entete = true ;
                $("#mdac_param_table").append("<thead><tr><th>&nbsp;Use this channel ?</th><th>Exposure time (ms)</th><th>Z-offset (um)</th><th>Configuration</th><th>Z-stack</th><th>Skip Frame</th><th>Action</th></tr></thead>");
            }
            $("#mdac_param_table").append("<tr id='tr"+id+"'><td>&nbsp;&nbsp;&nbsp;&nbsp;<input id='mdac_param_use"+id+"' type='checkbox'/></td><td><input id='mdac_param_exposure"+id+"' type='number' min='0' value='10'/></td><td><input id='mdac_param_zoffset"+id+"' type='number' min='0' value='10'/></td><td><select id='mdac_param_configuration"+id+"' ></select></td><td><input id='mdac_param_zstack"+id+"' type='checkbox'/></td><td><input id='mdac_param_skipframe"+id+"' type='number' min='0' value='10'/></td><td><button class='setting_button' id='mdac_param_delete"+id+"' ><img src='icons/cross.png'></button></td></tr>");
            for(var scan=0; scan<data.length;scan++) {
                if(scan ===0)requestWS("setMDAChannelsConfiguration=0,10,10,"+data[scan]['name']+"--"+data[scan]['device']+",0,10,"+id);
                $("#mdac_param_configuration"+id).append("<option value='"+data[scan]['id']+"'>"+data[scan]['name']+"--"+data[scan]['device']+"</option>");
            }
           
        }
    }
    $(document).on('click', 'input', function () {
        if(this.id.indexOf('mdac_param_use') !== -1){
            if($("#"+this.id).is(":checked")){ requestWS("setMDAChannelsConfigurationUse=1,"+this.id.replace('mdac_param_use',''));}
            else { requestWS("setMDAChannelsConfigurationUse=0,"+this.id.replace('mdac_param_use',''));}
        }
        if(this.id.indexOf('mdac_param_zstack') !== -1){
            if($("#"+this.id).is(":checked")){ requestWS("setMDAChannelsConfigurationZstack=1,"+this.id.replace('mdac_param_zstack',''));}
            else { requestWS("setMDAChannelsConfigurationZstack=0,"+this.id.replace('mdac_param_zstack',''));}
        }
    });
    $(document).on('click', 'span', function () {
        if(this.id.indexOf('setting_button_load_channel') !== -1){
            order = 'LoadSettingChannelsConfiguration';
            requestWS("LoadSettingChannelsConfiguration,"+this.id.substr(28,this.id.length));
            ref = this.id.substr(28,this.id.length);
            $("#name_configChannels").empty();
            $("#name_configChannels").append('<span>Configuration loaded: '+listConfigChannel[parseInt(this.id.substr(28,this.id.length))]+'</span>');
            //alert('LOAD');
          }
          //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(this.id.indexOf('setting_button_load_mda') !== -1){
          order = 'LoadSettingMda';
          requestWS("LoadSettingMda,"+this.id.substr(24,this.id.length));
          ref = this.id.substr(24,this.id.length);
          $("#name_configMda").empty();
          $("#name_configMda").append('<span>Configuration loaded: '+listConfigMda[parseInt(this.id.substr(24,this.id.length))]+'</span>');
            newSourceOption = {
            url: 'mda/'+ listConfigMda[parseInt(this.id.substr(24,this.id.length))],
            dataType: 'json',
          };
        }
        
        if(this.id.indexOf('live_olympusix81') !== -1){
                    $.confirm({
                        title: "OLYMPUS-IX-81",
                        theme: "modern",
                        content: 'url:form/olympusix81.html',
                        columnClass: 'col-md-8',
                        onContentReady: function () {
                            var self = this;
                            /*if(nodeParameters.data.xPosition === 0) self.$content.find('.xPosition').val(data['xPosition']);
                            else self.$content.find('.xPosition').val(nodeParameters.data.xPosition);
                            if(nodeParameters.data.yPosition === 0) self.$content.find('.yPosition').val(data['yPosition']);
                            else self.$content.find('.yPosition').val(nodeParameters.data.yPosition);
                            if(nodeParameters.data.zPosition === 0) self.$content.find('.zPosition').val(data['zPosition']);
                            else self.$content.find('.zPosition').val(nodeParameters.data.zPosition);
                            self.$content.find('.res1').val(nodeParameters.data.res1);
                            self.$content.find('.res2').val(nodeParameters.data.res2);*/
                        },
                        buttons: {
                            update: {
                                text: 'Update', // text for button
                                btnClass: 'btn-green', // class for the button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function(markorreplace){
                                    
                                    return false;
                                }
                            },
                            gotoposition: {
                                text: 'Go to position', // text for button
                                btnClass: 'btn-green', // class for the button
                                isHidden: false, // initially not hidden
                                isDisabled: false, // initially not disabled
                                action: function(gotoposition){
                                    
                                    return false;
                                }
                            },
                            quit: {
                                btnClass: 'btn-red',
                                action: function(){
                                    //, // class for the button
                                /*    var xPosition = this.$content.find('.xPosition').val();
                                    var yPosition = this.$content.find('.yPosition').val();
                                    var zPosition = this.$content.find('.zPosition').val();
                                    var res1 = this.$content.find('.res1').val();
                                    var res2 = this.$content.find('.res2').val();
                                    if(!xPosition){$.alert('provide a valid xPosition');return false;
                                    } else nodeParameters.data.xPosition = xPosition ;
                                    if(!yPosition){$.alert('provide a valid yPosition');return false;
                                    } else nodeParameters.data.yPosition= yPosition ;
                                    if(!zPosition){$.alert('provide a valid zPosition');return false;
                                    } else nodeParameters.data.zPosition = zPosition ;
                                    if(!res1){$.alert('provide a valid res1');return false;
                                    } else nodeParameters.data.res1 = res1 ;
                                    if(!res2){$.alert('provide a valid res2');return false;
                                    } else nodeParameters.data.res2 = res2 ;
                                    $.alert('Your paramaters are saving');
                                    openBox = false ;*/
                                    return true ;
                                }
                            }
                        }
                    });










        }    
            
            
    });
    var ref ;
    $(document).on('change', "input", function () {
        if(this.id.indexOf('mdac_param_exposure') !== -1){
            requestWS("setMDAChannelsConfigurationExposure="+$("#"+this.id).val()+","+this.id.replace('mdac_param_exposure',''));
        }
        if(this.id.indexOf('mdac_param_zoffset') !== -1){
            requestWS("setMDAChannelsConfigurationZoffset="+$("#"+this.id).val()+","+this.id.replace('mdac_param_zoffset',''));
        }
        if(this.id.indexOf('mdac_param_skipframe') !== -1){
            requestWS("setMDAChannelsConfigurationSkipframe="+$("#"+this.id).val()+","+this.id.replace('mdac_param_skipframe',''));
        }
        //MODIF 1
        if(this.id.indexOf('_c_') !== -1){ //1_c_A0
            requestWS('posLigth,'+this.id.substr(0,1)+","+this.id.substr(4,1)+","+this.id.substr(5,1)+","+$("#"+this.id).val());
            setTimeout(function(){
                order = 'LoadSettingChannelsConfiguration';
                requestWS("LoadSettingChannelsConfiguration,0");
            },1000);
            //alert('posLigth,'+this.id.substr(0,1)+","+this.id.substr(4,1)+","+this.id.substr(5,1)+","+$("#"+this.id).val());
        }
        //MODIF 1
        if(this.id.indexOf('posExposure') !== -1){ 
            requestWS('posExposure,'+$("#"+this.id).val());
        }
        
    });
    $(document).on('change', "select", function () {
        if(this.id.indexOf('mdac_param_configuration') !== -1){
            requestWS("setMDAChannelsConfigurationChannel="+$("#"+this.id).find(":selected").text()+","+this.id.replace('mdac_param_configuration',''));
        }
        //MODIF 1
        if(this.id.indexOf('_c_') !== -1){
            requestWS('posLigth,'+this.id.substr(0,1)+","+this.id.substr(4,1)+","+this.id.substr(5,1)+","+$("#"+this.id).find(":selected").val());
            setTimeout(function(){
                order = 'LoadSettingChannelsConfiguration';
                requestWS("LoadSettingChannelsConfiguration,0");
            },1000);
            //alert('ddd');
        }
        //MODIF 1
        if(this.id.indexOf('posInvert') !== -1){
            requestWS('posInvert,'+$("#"+this.id).find(":selected").val());
        }
        if(this.id.indexOf('posMap') !== -1){
            requestWS('posMap,'+$("#"+this.id).find(":selected").val());
        }
    });
  


////////////

  $(document).on('click', '.setting_button', function () {
        var id = this.id; //setting_button_add_channel
        if(id=='setting_button_new_configChannel'){
            $.confirm({
                title: "Settings name",
                theme: "modern",
                columnClass: 'col-md-4',
                closeIcon : true,
                content: '' +'<form action="">' +'<input type="text" placeholder="configuration 1" class="name" required /><br>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var name = this.$content.find('.name').val();
                            if(!name){$.alert('provide a valid name');return false;}
                            else {
                                    requestWS("configChannels,"+name);
                                    $("#name_configChannels").empty();
                                    ref = listConfigChannel.length ;
                                    order = 'listConfigChannel';
                                    requestWS(order);
                                    $("#setting_table_channel").empty();
                                    $("#available_channels_mda").empty();
                                    $("#name_configChannels").append('<span>Configuration: '+name+'.json</span>');
                                    nbOfSettingsChannels = -1;
                                    settingschannels = [];
                                }
                            //$.alert('You can add a different channels !');
                        }
                    }
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }
        if(id=='setting_button_toogle'){
            $("#tree").fancytree("getTree").visit(function(node){
                node.toggleExpanded();
              });
        }
        if(id=='setting_button_save_configMda'){
           $.confirm({
                title: "Loading to Simulator",
                theme: "modern",
                columnClass: 'col-md-8',
                closeIcon : true,
                content: 'Would you like to send the actual configuration to the simulator ?',
                buttons: {
                    NO: {
                        btnClass: 'btn-red', // class for the button
                        function () {
                            console.log('NO');
                        }
                    },
                    YES: {
                        text: 'YES', // With spaces and symbols
                        btnClass: 'btn-green', // class for the button
                        action: function () {
                            $.alert('Configuration sent to the simulator. Please go to the dashboard.');
                            requestWS("saveMDA;;"+JSON.stringify($("#tree").fancytree("getTree").toDict(true)));
                        }
                    }
                }
            });
                       
       
        }
        
        if(id=='setting_button_new_configMda'){
            $.confirm({
                title: "Settings name",
                theme: "modern",
                columnClass: 'col-md-4',
                closeIcon : true,
                content: '' +'<form action="">' +'<input type="text" placeholder="MDA 1" class="name" required /><br>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var name = this.$content.find('.name').val();
                            if(!name){$.alert('provide a valid name');return false;}
                            else {
                                    requestWS("configMda,"+name);
                                    $("#name_configMda").empty();
                                    ref = listConfigChannel.length ;
                                    order = 'listConfigMda';
                                    requestWS(order);

                              /*      $("#setting_table_channel").empty();
                                    $("#available_channels_mda").empty();
                                    $("#name_configChannels").append('<span>Configuration: '+name+'.json</span>');
                                    nbOfSettingsChannels = -1;
                                    settingschannels = [];*/
                                }
                            //$.alert('You can add a different channels !');
                        }
                    }
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }

              
        if(id=='setting_button_add_channel'){
            if(nbOfSettingsChannels  === -1) nbOfSettingsChannels  = 0 ;
            nbOfSettingsChannels = nbOfSettingsChannels + 1 ;
            //$("#label_config").show();
            //$("#name_config").show();
//
            $("setting_button_save_channel").hide();
            $("#setting_table_channel").append('<table id="channel'+nbOfSettingsChannels+'" class="table table-striped"></table>');
            $("#channel"+nbOfSettingsChannels).append("<thead><tr><th></th><th>Name Channel</th><th>Light Source</th><th style='width:500px;'></th><th></th><th></th><th></th><th></th></tr></thead>");
            $("#channel"+nbOfSettingsChannels).append("<tbody><tr><td id='chk"+nbOfSettingsChannels+"'></td><td id='"+nbOfSettingsChannels+"_name'></td><td id='option"+nbOfSettingsChannels+"'></td><td id='config"+nbOfSettingsChannels+"'></td><<td id='delete"+nbOfSettingsChannels+"'></td></tr></tbody>");
            $("#"+nbOfSettingsChannels+"_name").append("<input required name='"+nbOfSettingsChannels+"_channel' id='"+nbOfSettingsChannels+"_channel 'type='text' placeholder='channel " + nbOfSettingsChannels + "'/>");
            $("#option"+nbOfSettingsChannels).append("<select class='settings_select_device' name='"+nbOfSettingsChannels+"_devices' id='"+nbOfSettingsChannels+"_devices'></select>");
            var saveId = -1;
            for(var i=0; i<ressources.length;i++){
                if(ressources[i]['type'] == 'ligth-source'){if(saveId === -1) saveId = i ;$('#'+nbOfSettingsChannels+'_devices').append("<option value=" + i + ">" + ressources[i]['device']  + "</option>");}
            }
            //alert('#config '+nbOfSettingsChannels);
            buidFormSettingsChannels('#config',saveId,nbOfSettingsChannels);
            $("#delete"+nbOfSettingsChannels).append("<button class='setting_button' name='settingchannels_del"+nbOfSettingsChannels+"' id='settingchannels_del"+nbOfSettingsChannels+"'><img src='icons/cross.png'></button>");
        if(nbOfSettingsChannels === -1) {$("#setting_button_save_channel").prop('disabled',true);}
        else { $("#setting_button_save_channel").prop('disabled',false);}
        }
        if(id=='setting_button_load_channel'){
            order = 'LoadSettingChannelsConfiguration';
            requestWS("LoadSettingChannelsConfiguration");
        }
      
        if(id.indexOf('settingchannels_del') !== -1){
            if (confirm("Delete this channel ?")) {
              $("#channel"+id.replace('settingchannels_del','')).remove();
            }
        }
        if(id.indexOf('mdac_param_delete') !== -1){
            if (confirm("Delete this configuration ?")) {
              $("#tr"+id.replace('mdac_param_delete','')).remove();
              requestWS("MDAChannelsConfigurationRemove="+id.replace('mdac_param_delete',''));
            }
        }
  });
  
    $(document).on('change', '.settings_select_device', function () {
        var id = this.id; 
        var selection = id.replace("_devices","");
        $('#config'+selection).closest("td").empty();
        buidFormSettingsChannels('#config',$(this).val(),selection);
    });

    ////MODIF 1
    $(document).on('change', '.settings_select_channel', function () {
        //request()
        var id = this.id; 
        var selection = id.replace("_devices","");
        //alert($("#settings_select_channel").find(":selected").text())
        requestWS('posLigth,'+$("#settings_select_channel").find(":selected").val());
        //alert(id+"-"+selection);
        //$('#config'+selection).closest("td").empty();
        buidAdjustChannels($("#settings_select_channel").find(":selected").val());
    });

    //MODIF 1
    function buidAdjustChannels(target){
        //alert(target);
        //if(target !== -1) {$('#posAdjustName').append("Adjusting channel");}
        $('#posAdjustName').empty();
        $('#posAdjust').empty();
        for(var key in settingschannels[target]["config"]) {
            for(var element=0; element<settingschannels[target]['config'][key].length;element++){
                $('#posAdjust').append(settingschannels[target]['config'][key][element].replace(/%/gi, target+"_c_")+"&nbsp;");
                if(settingschannels[target]['config'][key][element].indexOf('select') !==-1){
                    $('#'+target+"_c_"+key+element+" option[value='"+settingschannels[target]['update'][key][element]+"']").prop('selected', true);
                }
                if(settingschannels[target]['config'][key][element].indexOf('number') !==-1) $('#'+target+"_c_"+key+element).val(settingschannels[target]['update'][key][element]);
                if(settingschannels[target]['config'][key][element].indexOf('color') !==-1){
                            //alert("color:"+data[scan]['update'][key][element]);
                    $('#'+target+"_c_"+key+element).val(settingschannels[target]['update'][key][element]);            
                }
            }
            $("#posAdjust").append("<br>");      
        }
        
    }
    
    //MODIF 1    
    function buidFormSettingsChannels(where,target,selection){
        for(var key in ressources[target]["config"]) {
            for(var element=0; element<ressources[target]['config'][key].length;element++){
                $("#config"+selection).append(ressources[target]['config'][key][element].replace(/%/gi, selection+"_")+"&nbsp;");
                if(ressources[target]['config'][key][element].indexOf('select') !==-1){
                    //alert('#'+selection+"_"+key+element+" option[value='"+ressources[target]['update'][key][element]+"']");
                    $('#'+selection+"_"+key+element+" option[value='"+ressources[target]['update'][key][element]+"']").prop('selected', true);
                }
                if(ressources[target]['config'][key][element].indexOf('number') !==-1) $('#'+selection+"_"+key+element).val(ressources[target]['update'][key][element]);
                if(ressources[target]['config'][key][element].indexOf('color') !==-1) $('#'+selection+"_"+key+element).val(ressources[target]['update'][key][element]);
            
            }
            $("#config"+selection).append("<br>");      
        }
    }

    $(document).ready(function(){
        $("#alert-warning").hide();
        $("#alert-success").hide();
        wait();
    });
  
    function alertmessage(msg,classmsg){
      /*$(classmsg).append(msg);
      $(classmsg).show();
      setTimeout(function(){
          $(classmsg).hide();
          $(classmsg).empty();
          },2000);*/
        $.alert({
             title: "Saving parameters",
             theme: "modern",
             content : "SUCCESS !"
        });
  }
    
    function test(){
      var title = listConfigMda[ref];
      $.confirm({
        title: "Starting : "+title,
        theme: "modern",
        columnClass: 'col-md-8',
        closeIcon : true,
        content: 'Would you start the MDA now ?',
        buttons: {
            cancel: {
                text: 'Cancel', // text for button
                btnClass: 'btn-red', // class for the button
                isHidden: false, // initially not hidden
                isDisabled: false, // initially not disabled
                action: function(cancel){
                  return true;
                }
            },
            start: {
                text: 'Start the MDA', // text for button
                btnClass: 'btn-green', // class for the button
                isHidden: false, // initially not hidden
                isDisabled: false, // initially not disabled
                action: function(start){
                  var tree = $("#tree").fancytree("getTree");
                  var d = tree.toDict(true);
                  d['type'] = 'mda';
                  requestWS(JSON.stringify(d));
                  order = 'mdaRunning';        
                  console.log(JSON.stringify(d));
                  console.log(order);
            
                  $.confirm({
                    title: 'Run in progress ....',
                    theme: "modern",
                    columnClass: 'col-md-12',
                    content: '<div id="mdaL" >testing...<br><img id="mdaCapture"></img></div>',        
                    buttons: {
                        stop: {
                            text: 'stop', // text for button
                            btnClass: 'btn-yellow', // class for the button
                            isHidden: false, // initially not hidden
                            isDisabled: false, // initially not disabled
                            action: function(cancel){
                              order = '';
                              requestWS("MDA-FINISH");
                              return false;
                            }
                        },
                        close: {
                            text: 'close', // text for button
                            btnClass: 'btn-red', // class for the button
                            isHidden: false, // initially not hidden
                            isDisabled: false, // initially not disabled
                            action: function(cancel){
                              order = '';
                              requestWS("MDA-FINISH");
                              return true;
                            }
                        }

                    }
                  });
                }
              }
            }
          });
        
    }

    function editTree(){

                                
        var node = $("#tree").fancytree("getActiveNode");
        //MODIF 1
        /*if(node.type === 'PROT'){
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                columnClass: 'col-md-8',
                closeIcon : true,
                content: '' +'<form action="" class="formName">' +'<div class="form-group">' +'<label>Comment</label>' +'<textarea  type="text" cols="40" rows="5" style="width:100%; height:100px;" class="comment form-control" >'+node.data.comment+'</textarea>' +'<label>Prefix</label>' +'<input type="text" class="prefix form-control" required value="'+node.data.prefixe+'"/>'+'</div>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var comment = this.$content.find('.comment').val();
                            var prefix = this.$content.find('.prefix').val();
                            if(comment){node.data.comment = comment ;}
                            if(!prefix){$.alert('provide a valid prefix');return false;
                            } else {node.data.prefixe= prefix;}
                        }
                    }
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }*///MODIF1
        if(node.type === 'CAMERA'){
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                columnClass: 'col-md-8',
                closeIcon : true,
                content: '' +'<form action="" class="formName">' +'<div class="form-group">' +'<label>Time exposure (ms) *</label>' +'<input type="number" class="time form-control" required value="'+node.data.time+'"/>' +'<label>Number of picture *</label>' +'<input type="number" class="number form-control" required value="'+node.data.number+'"/>' +'<label>Z offset *</label>' +'<input type="number" class="zoffset form-control" required value="'+node.data.zoffset+'"/>' +'<label>Skip picture *</label>' +'<input type="number" class="skip form-control" required value="'+node.data.skip+'"/>' +'<br> * not available yet</div>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var time = this.$content.find('.time').val();
                            var skip = this.$content.find('.skip').val();
                            var zoffset = this.$content.find('.zoffset').val();
                            var number = this.$content.find('.number').val();
                            if(!time){$.alert('provide a valid time');return false;
                            } else node.data.time = time ;
                            if(!skip){$.alert('provide a valid skip');return false;
                            } else node.data.skip = skip ;
                            if(!zoffset){$.alert('provide a valid zoffset');return false;
                            } else node.data.zoffset = zoffset ;
                            if(!number){$.alert('provide a valid number');return false;
                            } else node.data.number = number ;
                        }
                    }
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }
        //MODIF 1
        if(node.type === 'LOOP'){
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                columnClass: 'col-md-8',
                closeIcon : true,
                content: '' +'<form action="" class="formName">' +'<div class="form-group">' +'<label>Time (min)</label>' +'<input type="number" class="time form-control" required value="'+node.data.time+'"/>' +'<label>Repeat</label>' +'<input type="number" class="repeat form-control" required value="'+node.data.repeat+'"/>' +'</div>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var time = this.$content.find('.time').val();
                            var repeat = this.$content.find('.repeat').val();
                            if(!time){$.alert('provide a valid time');return false;
                            } else node.data.time = time ;
                            if(!repeat){$.alert('provide a valid repeat');return false;
                            } else node.data.repeat = repeat ;
                        }
                    }
                },
                onContentReady: function () {
                    // bind to events
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click');
                    });
                }
            });
        }
        //MODIF 1
        if(node.type === 'LIGHT'){
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                closeIcon : true,
                content: '' +'<form action="" class="formName">' +'<div class="form-group">' +'<label>Time exposure (ms)</label>' +'<input type="number" class="time form-control" required value="'+node.data.time+'"/>' +'<label>Wheel filter</label>' +'<input type="number" min="1" max="6" class="wheel form-control" required value="'+node.data.wheel+'"/>' +'<label>Skip channel</label>' +'<input type="number" class="skip form-control" required value="'+node.data.skip+'"/></div>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        closeIcon : true,
                        btnClass: 'btn-blue',
                        action: function () {
                            var time = this.$content.find('.time').val();
                            var color = this.$content.find('.color').val();
                            var wheel = this.$content.find('.wheel').val();
                            var skip  = this.$content.find('.skip').val();
                            if(!time){$.alert('provide a valid time');return false;
                            } else node.data.time = time ;
/*                            if(!color){$.alert('provide a valid color');return false;
                            } else node.data.color = color ;*/
                            if(!skip){$.alert('provide a valid skip');return false;
                            } else node.data.skip = skip ;
                            if(!wheel){$.alert('provide a valid wheel');return false;
                            } else if ((wheel>=1)&&(wheel<7)) node.data.wheel = wheel ;
                            else {$.alert('provide a valid wheel');return false;}
                        }//MODIF 1
                    }
                },
                onContentReady: function () {
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }
        //MODIF 1
        if(node.type === 'AF'){
            order = '';
            requestWS('posMap,ON');
            requestWS('posInvert,OFF');
            requestWS('mappingcolor,808080');
            order = 'getAutofocus';
            nodeParameters = node;
            requestWS('getAutofocus');
        }
        if(node.type === 'XYZ'){
            order = '';
            requestWS('posMap,ON');
            requestWS('posInvert,OFF');
            requestWS('mappingcolor,808080');
            order = 'getValueXYZ';
            nodeParameters = node;
            requestWS('getValueXYZ');
        }
        //MODIF 1
        if(node.type === 'ZS'){
            order = '';
            requestWS('posMap,ON');
            requestWS('posInvert,OFF');
            requestWS('mappingcolor,808080');
            if(node.data.shutter) var check = 'checked' ;
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                content: 'url:form/zs.html',
                boxWidth: '1350px',
                useBootstrap: false,//
                closeIcon : true,
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-green',
                        action: function () {
                            //var skip = this.$content.find('.skip').val();
                            var zstart = this.$content.find('.zstart').val();
                            var zend = this.$content.find('.zend').val();
                            var zstep = this.$content.find('.zstep').val();
                            //var shutter  = $(".shutter").is(":checked");
                            //if(!skip){$.alert('provide a valid skip');return false;
                            //} else node.data.skip = skip ;
                            if((zstart)===(zend)){$.alert('provide a valid zstart and zend');return false;}
                            if((!zstart)||(zstart>0)){$.alert('provide a valid zstart');return false;
                            } else node.data.zstart = zstart ;
                            if((!zend)||(zend<0)){$.alert('provide a valid zend');return false;
                            } else node.data.zend = zend ;
                            if((!zstep)||(zstep<1)){$.alert('provide a valid zstep');return false;
                            } else node.data.zstep = zstep ;
                        
                            var trigg = $('.trigger').find(":selected").text(); //this.$content.find('.aftbl').val();
                            //alert(trigg);
                            node.data.trigger= trigg;
                        }
                    },
                    cancel: {
                        text: 'cancel', // text for button
                        btnClass: 'btn-red', // class for the button
                        isHidden: false, // initially not hidden
                        isDisabled: false, // initially not disabled
                        action: function(cancel){
                            return true;
                        }
                    }
                },
                onContentReady: function () {
                    
                    $("#posEnligth").append("<select class='settings_select_channel' id='settings_select_channel'></select>");
                    $('#settings_select_channel').append("<option value='-1'>Turn everything off</option>");
                    for(var scan=1; scan<settingschannels.length;scan++){
                        $('#settings_select_channel').append("<option value=" + scan + ">" + settingschannels[scan]['name']  + "</option>");
                    }
                    $(".zstart").val(node.data.zstart);
                    $(".zend").val(node.data.zend);
                    $(".zstep").val(node.data.zstep);
                    $(".trigger option[value='"+node.data.trigger+"']").prop('selected', true);
                                
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        }
        if(node.type === 'Mosaic'){
            $.confirm({
                title: "Settings: "+node.title,
                theme: "modern",
                columnClass: 'col-md-12',
                closeIcon : true,
                content:  'url:form/mosaic.html',//'' +'<form action="" class="formName">' +'<div class="form-group">' +'<label>Time (min)</label>' +'<input type="number" class="time form-control" required value="'+node.data.time+'"/>' +'<label>Repeat</label>' +'<input type="number" class="repeat form-control" required value="'+node.data.repeat+'"/>' +'</div>' +'</form>',
                buttons: {
                    formSubmit: {
                        text: 'valid',
                        btnClass: 'btn-blue',
                        action: function () {
                            var time = this.$content.find('.time').val();
                            var repeat = this.$content.find('.repeat').val();
                            if(!time){$.alert('provide a valid time');return false;
                            } else node.data.time = time ;
                            if(!repeat){$.alert('provide a valid repeat');return false;
                            } else node.data.repeat = repeat ;
                        }
                    }
                },
                onContentReady: function () {
                    // bind to events
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click');
                    });
                }
            });
        }

        
    }