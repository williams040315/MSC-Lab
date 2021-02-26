// TRANSLATE AN IMAGE TO A MATRIX, EACH CELL IS RATE BETWEEN 0 AND 255.
// 255 IS WHITE AND 0 IS BLACK.
// MADE BY PIERRE-LOUIS CRESCITZ


#include "my_mosaic.h"
#include <signal.h>

void sighandler(int signal) {
	std::cout << "OK" << std::endl;
}

int main()
{
	std::string file_name("C:/Users/labo/customizeNode/node-red-contrib-andor-mosaic3/AndorMosaic3/video_feed.jpg");
	Mosaic mosaic(file_name);

	try {
		mosaic.sendBufferToMosaic();
	}
	catch (std::exception const& e) {
		std::cout << e.what() << std::endl;
	}
	std::cout << "done" << std::endl;
	return (0);
}
