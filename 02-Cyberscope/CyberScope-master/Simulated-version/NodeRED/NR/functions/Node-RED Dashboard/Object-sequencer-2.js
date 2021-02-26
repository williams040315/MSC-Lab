// name: Object sequencer 2
// outputs: 1
context.global.extent = true ;
context.global.valid = false ;
context.global.sequence2 = {
    "0" : 
        [
            [{
            'topic' : '4',
            'device' : '4',
            'sync' : 0,
            'extent' : false
            }],
            [{
            'topic' : '3',
            'device' : '3',
            'sync' : 0,
            'extent' : false
            }],
            [{
            'topic' : '2',
            'device' : '2',
            'sync' : 0,
            'extent' : false
            }],
            [{
            'topic' : '1',
            'device' : '1',
            'sync' : 0,
            'extent' : false
            }]//,
            /*[{
            'topic' : 'function1',
            'device' : 'function1',
            'paylaod' : 'MDA-FINISH'
            }]*/
        ],
    "10" : 
        [
            [{
            'topic' : '4',
            'device' : '4',
            'sync' : 10,
            'extent' : true
            }],
            [{
            'topic' : '3',
            'device' : '3',
            'sync' : 10,
            'extent' : true
            }],
            [{
            'topic' : '2',
            'device' : '2',
            'sync' : 10,
            'extent' : true
            }],
            [{
            'topic' : 'break',
            'device' : 'break',
            'payload' : 'MDA-BREAK'
            }]
        ],
    "20" : 
        [
            [{
            'topic' : '4',
            'device' : '4',
            'sync' : 20,
            'extent' : false
            }],
        [{
            'topic' : '3',
            'device' : '3',
            'sync' : 20,
            'extent' : false
            }],
            [{
            'topic' : '2',
            'device' : '2',
            'sync' : 20,
            'extent' : false
            }],
            [{
            'topic' : '1',
            'device' : '1',
            'sync' : 20,
            'extent' : false
            }]
        ],
    "30" : 
        [
            [{
            'topic' : '4',
            'device' : '4',
            'sync' : 30,
            'extent' : true
            }],
            [{
            'topic' : '3',
            'device' : '3',
            'sync' : 30,
            'extent' : true
            }],
            [{
            'topic' : '2',
            'device' : '2',
            'sync' : 30,
            'extent' : true
            }],
            [{
            'topic' : '1',
            'device' : '1',
            'sync' : 30,
            'extent' : true
            }]
        ],
        "40" : 
            [
                [{
                'topic' : '4',
                'device' : '4',
                'sync' : 40,
                'extent' : false
                }]
            ],
        "50" : 
            [
                [{
                'topic' : '4',
                'device' : '4',
                'sync' : 50,
                'extent' : true
                }],
                [{
                'topic' : '3',
                'device' : '3',
                'sync' : 50,
                'extent' : true
                }],
                [{
                'topic' : '2',
                'device' : '2',
                'sync' : 50,
                'extent' : true
                }],
                [{
                'topic' : '1',
                'device' : '1',
                'sync' : 50,
                'extent' : true
                }],
                [{
                'payload' : 'MDA-FINISH',
                'sync' : 50,
                'extent' : true
                }]
            ]
}