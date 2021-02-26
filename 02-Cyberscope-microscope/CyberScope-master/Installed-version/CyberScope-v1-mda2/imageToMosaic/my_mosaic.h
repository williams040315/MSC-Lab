#pragma once

#ifndef __MY_MOSAIC__
# define __MY_MOSAIC__

# include "opencv2/opencv.hpp"
# include "opencv2/highgui/highgui.hpp"
# include "opencv2/imgproc/imgproc.hpp"
# include "atcore.h"
# include <iostream>
# include <vector>
# include <sstream>
# include <fstream>
# include <string>
# include <stdlib.h>

# define BUFFER_SIZE 800 * 600
# define LIMIT_BINARY 30

class Mosaic {
public:
	Mosaic(std::string&);
	~Mosaic();
	void writePidInFile();
	void matrixToBuffer();
	void sendBufferToMosaic();
	void waitToShutDown();
private:
	AT_H Handle;
	cv::Mat matrix;
	std::vector<uchar> array;
	unsigned char* UserBuffer;
	int isError = 0;
};

#endif // !__MY_MOSAIC__
