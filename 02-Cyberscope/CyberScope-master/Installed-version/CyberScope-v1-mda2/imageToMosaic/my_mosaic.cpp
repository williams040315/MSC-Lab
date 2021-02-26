#include "my_mosaic.h"

Mosaic::Mosaic(std::string &file_name)
{
	this->matrix = cv::imread(file_name, 0);
}

Mosaic::~Mosaic()
{

}

void	Mosaic::writePidInFile()
{
	std::ofstream myfile;

	myfile.open("my_pid.txt", std::ios::trunc);
	myfile << _getpid();
	myfile.close();
}

void	Mosaic::matrixToBuffer()
{
	std::cout << "Starting fill array" << std::endl;
	if (this->matrix.isContinuous()) {
		this->array.assign((uchar*)this->matrix.datastart, (uchar*)this->matrix.dataend);
	}
	else {
		for (int i = 0; i < this->matrix.rows; ++i) {
			this->array.insert(array.end(), this->matrix.ptr<uchar>(i), this->matrix.ptr<uchar>(i) + this->matrix.cols);
		}
	}
	std::cout << "Starting fill UserBuffer" << std::endl;

	int parser = 0;
	while (parser < BUFFER_SIZE) {
		if (this->array[parser] >= LIMIT_BINARY)
			this->UserBuffer[parser] = 1;
		parser++;
	}
	std::cout << "Buffer filled! parser = " << parser << " Buffer size = " << strlen((const char*)this->UserBuffer) << std::endl;
}

void	Mosaic::sendBufferToMosaic()
{
	AT_InitialiseLibrary();
	AT_Open(0, &Handle);

	//Set InfiniteExposure feature to false to allow setting a limited exposure time
	AT_SetBool(Handle, L"InfiniteExposure", 0);

	//Set the exposure time for this device to 60 seconds
	AT_SetFloat(Handle, L"ExposureTime", 60);


	this->UserBuffer = (unsigned char*)malloc(sizeof(unsigned char) * (BUFFER_SIZE));

	//Pass this buffer to the SDK
	AT_QueueBuffer(Handle, this->UserBuffer, BUFFER_SIZE);

	//Abort the currently displayed image on device (if any)
	AT_Command(Handle, L"Abort");

	//Clear the user buffer*/
	memset(this->UserBuffer, 0, BUFFER_SIZE);

	//Populate UserBuffer with the rectangle shape
	/*for (int y = 100; y < i64_sensorHeight - 100; y++) {
		for (int x = 100; x < i64_sensorWidth - 100; x++) {
			UserBuffer[y * i64_sensorWidth + x] = 1;
		}
	}*/

	this->matrixToBuffer();//i64_sensorHeight, i64_sensorWidth, BufferSize);

	//std::cout << "Writing PID in my_pid.txt" << std::endl;
	//this->writePidInFile();

	//Start exposing the rectangle shape
	AT_Command(Handle, L"Expose");
	std::cout << "Starting exposition" << std::endl;
	AT_BOOL IsExposing;
	do {
		this->waitToShutDown();
		AT_GetBool(Handle, L"IsExposing", &IsExposing);
	} while (IsExposing == TRUE);

	AT_Close(Handle);
	AT_FinaliseLibrary();
}

void	Mosaic::waitToShutDown()
{
	std::ifstream my_file("C:/Users/labo/customizeNode/node-red-contrib-andor-mosaic3/AndorMosaic3/mosaic_status.txt");
	std::string line;

	if (!my_file.is_open()) {
		return;
	}
	getline(my_file, line);
	my_file.close();
	if (line.compare("OFF") == 0) {
		AT_Command(Handle, L"Abort");
		AT_Close(Handle);
		AT_FinaliseLibrary();
		exit(0);
	}
}