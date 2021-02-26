function execOrdersInPosition(order) {
    for (var i = 0; order[i]; i++) {
        switch (order[i].type) {
            case 'AF':
                node.warn("AutoFocus: " + order[i].data.objectif + " range: " + order[i].data.range + " zoffset: " + order[i].data.zoffset);
                break;
            case 'ZS+SC':
                node.warn("Z-Stack, far limit: " + order[i].data.far_limit + " near limit: " + order[i].data.near_limit + " step: " + order[i].data.step + " keep shutter on ? : "+ order[i].data.keep_shutter_on_wzs + " Settings channel: " + order[i].data.setting_channel_name + " exposure_time: " + order[i].data.exposure_time + "ms");
                break;
            case 'ZS+SC+M':
                node.warn("Z-Stack, far limit: " + order[i].data.far_limit + " near limit: " + order[i].data.near_limit + " step: " + order[i].data.step + " keep shutter on ? : "+ order[i].data.keep_shutter_on_wzs + " Settings channel: " + order[i].data.setting_channel_name + " exposure_time: " + order[i].data.exposure_time + "ms" + " Mosaic Mask: " + order[i].data.mosaic_mask_name);
                break;
            case 'SP+SC':
                node.warn("Settings channel: " + order[i].data.setting_channel_name + " Exposure time: " + order[i].data.exposure_time + "ms");
                break;
            case 'SP+SC+M':
                node.warn("Settings channel: " + order[i].data.setting_channel_name + " Exposure time: " + order[i].data.exposure_time + "ms Mosaic Mask: " + order[i].data.mosaic_mask_name);
                break;
            case 'MFV':
                node.warn("Microfluidics Valves : " + order[i].data.valve_1 + " " + order[i].data.valve_2 + " " + order[i].data.valve_3 + " " + order[i].data.valve_4 + " " + order[i].data.valve_5 + " ");
                break;
            case 'XYZ':
                break;
            default:
                node.warn("Unknown action: " + order[i].type);
                break;
            
        }
    }
}

function toMs(time_in_m) {
    return (time_in_m * 60 * 1000);
}


function execSequence(sequence) {
    var nb_repetition = parseInt(sequence.data.nb_repetition);
    var time_per_repetition = parseInt(sequence.data.time_per_repetition);
    
    if (!nb_repetition || nb_repetition <= 0) {
        node.warn("ERROR 1");
    }
    if (!time_per_repetition || time_per_repetition <= 0) {
        node.warn("ERROR 2");
    }
    while (nb_repetition !== 0) {
        for (var i = 0; sequence.children[i]; i++) {
            switch (sequence.children[i].type) {
                // NODE LIKE XYZ, DELAY, GROUP (Node at Protocol->Sequence->HERE)
                case 'XYZ':
                    node.warn("Going to position: " + sequence.children[i].data.xPosition + " " + sequence.children[i].data.yPosition + " " + sequence.children[i].data.zPosition);
                    execOrdersInPosition(sequence.children[i].children);
                    break;
                case 'DELAY':
                    node.warn("Delay for " + sequence.children[i].data.time + "ms");
                    break;
                case 'GROUP':
                    node.warn("Entering in GROUP POSITION");
                    for (var j = 0; sequence.children[i].children[j]; j++) {
                        switch (sequence.children[i].children[j].type) {
                            case 'XYZ':
                                node.warn("Going to position: " + sequence.children[i].children[j].data.xPosition + " " + sequence.children[i].children[j].data.yPosition + " " + sequence.children[i].children[j].data.zPosition);
                                execOrdersInPosition(sequence.children[i].children);
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                default:
                    node.warn("Unknown node: " + sequence.children[i].type + ", just skipping.");
                    break;
            }
        }
        nb_repetition--;
    }
}

var protocol = JSON.parse(msg.payload.protocol_data);
for (var i  = 0; protocol.children[0].children[i]; i++) {
    execSequence(protocol.children[0].children[i]);
}

return msg;