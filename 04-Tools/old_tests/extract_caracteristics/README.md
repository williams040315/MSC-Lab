Installation / start-up
----------------------------
1. Install the recommended version of Python and all of its OpenCV dependencies
2. Launch the terminal command 'python extract_caracteristics.py name_of_picture' since the current repertory
3. Pressed a key to quit the programm

Note
----
You can use 8bits or 16bits image ; The image must be in RGB mode. If it's not the case, you must modify the color space in the initial code.
Visit https://docs.opencv.org/3.4/d1/d32/tutorial_py_contour_properties.html if you need some information about the differents caracteristics.

Output format JSON
------------------
We use JSON format in order to inject the result in Cyberscope

`Indentation format`: {
  "img": "img1.png",
  "histogram": {
    "black": false,
    "white": false,
    "noise": false
  },
  "NCell": 27,
  "Extract": {
    "Cell-0": {
      "barycenter": {
        "x": 233,
        "y": 499
      },
      "geometry": {
        "area": 13.0,
        "perimeter": 13.656854152679443
      },
      "meanIntensity": 90.0
    },
    "Cell-1": {
      "barycenter": {
        "x": 244,
        "y": 494
      },
      "geometry": {
        "area": 10.5,
        "perimeter": 12.242640614509583
      },
      "meanIntensity": 98.47058823529412
    },
    "Cell-2": {
      "barycenter": {
        "x": 42,
        "y": 463
      },
      "geometry": {
        "area": 4.0,
        "perimeter": 8.0
      },
      "meanIntensity": 41.33333333333333
    },
    "Cell-3": {
      "barycenter": {
        "x": 18,
        "y": 464
      },
      "geometry": {
        "area": 18.0,
        "perimeter": 16.485281229019165
      },
      "meanIntensity": 93.11538461538463
    },
    "Cell-4": {
      "barycenter": {
        "x": 50,
        "y": 462
      },
      "geometry": {
        "area": 3.5,
        "perimeter": 7.414213538169861
      },
      "meanIntensity": 34.625
    },
    "Cell-5": {
      "barycenter": {
        "x": 423,
        "y": 447
      },
      "geometry": {
        "area": 12.5,
        "perimeter": 14.242640614509583
      },
      "meanIntensity": 75.60000000000001
    },
    "Cell-6": {
      "barycenter": {
        "x": 424,
        "y": 438
      },
      "geometry": {
        "area": 12.0,
        "perimeter": 13.656854152679443
      },
      "meanIntensity": 89.3157894736842
    },
    "Cell-7": {
      "barycenter": {
        "x": 486,
        "y": 434
      },
      "geometry": {
        "area": 19.0,
        "perimeter": 16.485281229019165
      },
      "meanIntensity": 131.03703703703704
    },
    "Cell-8": {
      "barycenter": {
        "x": 411,
        "y": 432
      },
      "geometry": {
        "area": 11.0,
        "perimeter": 12.485281229019165
      },
      "meanIntensity": 74.58823529411765
    },
    "Cell-9": {
      "barycenter": {
        "x": 474,
        "y": 432
      },
      "geometry": {
        "area": 13.5,
        "perimeter": 15.071067690849304
      },
      "meanIntensity": 153.09523809523807
    },
    "Cell-10": {
      "barycenter": {
        "x": 400,
        "y": 429
      },
      "geometry": {
        "area": 14.0,
        "perimeter": 14.485281229019165
      },
      "meanIntensity": 111.04761904761904
    },
    "Cell-11": {
      "barycenter": {
        "x": 419,
        "y": 424
      },
      "geometry": {
        "area": 11.5,
        "perimeter": 13.071067690849304
      },
      "meanIntensity": 78.27777777777777
    },
    "Cell-12": {
      "barycenter": {
        "x": 405,
        "y": 420
      },
      "geometry": {
        "area": 11.5,
        "perimeter": 13.41421353816986
      },
      "meanIntensity": 113.1578947368421
    },
    "Cell-13": {
      "barycenter": {
        "x": 92,
        "y": 314
      },
      "geometry": {
        "area": 8.5,
        "perimeter": 11.41421353816986
      },
      "meanIntensity": 94.4
    },
    "Cell-14": {
      "barycenter": {
        "x": 79,
        "y": 313
      },
      "geometry": {
        "area": 11.5,
        "perimeter": 13.071067690849304
      },
      "meanIntensity": 95.6111111111111
    },
    "Cell-15": {
      "barycenter": {
        "x": 90,
        "y": 307
      },
      "geometry": {
        "area": 9.5,
        "perimeter": 13.071067690849304
      },
      "meanIntensity": 78.0
    },
    "Cell-16": {
      "barycenter": {
        "x": 84,
        "y": 301
      },
      "geometry": {
        "area": 12.5,
        "perimeter": 13.071067690849304
      },
      "meanIntensity": 90.94736842105263
    },
    "Cell-17": {
      "barycenter": {
        "x": 502,
        "y": 262
      },
      "geometry": {
        "area": 14.5,
        "perimeter": 15.071067690849304
      },
      "meanIntensity": 120.68181818181819
    },
    "Cell-18": {
      "barycenter": {
        "x": 496,
        "y": 250
      },
      "geometry": {
        "area": 12.5,
        "perimeter": 13.071067690849304
      },
      "meanIntensity": 76.94736842105263
    },
    "Cell-19": {
      "barycenter": {
        "x": 508,
        "y": 250
      },
      "geometry": {
        "area": 10.0,
        "perimeter": 12.485281229019165
      },
      "meanIntensity": 89.5
    },
    "Cell-20": {
      "barycenter": {
        "x": 107,
        "y": 198
      },
      "geometry": {
        "area": 9.0,
        "perimeter": 12.0
      },
      "meanIntensity": 93.3125
    },
    "Cell-21": {
      "barycenter": {
        "x": 304,
        "y": 190
      },
      "geometry": {
        "area": 7.5,
        "perimeter": 10.242640614509583
      },
      "meanIntensity": 45.38461538461539
    },
    "Cell-22": {
      "barycenter": {
        "x": 110,
        "y": 187
      },
      "geometry": {
        "area": 15.0,
        "perimeter": 14.828427076339722
      },
      "meanIntensity": 118.78260869565217
    },
    "Cell-23": {
      "barycenter": {
        "x": 417,
        "y": 60
      },
      "geometry": {
        "area": 18.0,
        "perimeter": 15.656854152679443
      },
      "meanIntensity": 156.96153846153848
    },
    "Cell-24": {
      "barycenter": {
        "x": 404,
        "y": 51
      },
      "geometry": {
        "area": 14.0,
        "perimeter": 13.656854152679443
      },
      "meanIntensity": 113.23809523809523
    },
    "Cell-25": {
      "barycenter": {
        "x": 318,
        "y": 8
      },
      "geometry": {
        "area": 20.0,
        "perimeter": 25.313708305358887
      },
      "meanIntensity": 88.75
    },
    "Cell-26": {
      "barycenter": {
        "x": 265,
        "y": 0
      },
      "geometry": {
        "area": 5.0,
        "perimeter": 10.828427076339722
      },
      "meanIntensity": 72.63636363636364
    }
  }
}

------------------------------------------------------------------------------------------------------------------------------------------
Williams BRETT | Lab513 | wllmsbrtt@gmail.com for any questions
