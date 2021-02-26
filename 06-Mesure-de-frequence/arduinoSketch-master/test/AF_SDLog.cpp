#include <avr/io.h>
#include "AF_SDLog.h"
#include "fat16.h"
#include "sd_raw.h"
#include "partition.h"
#include <string.h>


#if !USE_DYNAMIC_MEMORY


  struct partition_struct partition_handles[PARTITION_COUNT];
#endif




AF_SDLog::AF_SDLog(void) {

}

uint8_t AF_SDLog::init_card(void) {
  return sd_raw_init();
}

uint8_t AF_SDLog::open_partition(void) {
  /* open first partition */
  partition = 
    partition_open(sd_raw_read,
		   sd_raw_read_interval,
		   sd_raw_write,
		   sd_raw_write_interval,
		   0);

  if(!partition) {
    /* If the partition did not open, assume the storage device
     * is a "superfloppy", i.e. has no MBR.
     */
    partition =   
      partition_open(sd_raw_read,
		     sd_raw_read_interval,
		     sd_raw_write,
		     sd_raw_write_interval,
		     -1);
  }
  if(!partition) {
    return 0;
  }
  return 1;
}
uint8_t AF_SDLog::open_filesys(void) {
  /* open file system */
  fs = fat16_open(partition);
  if(!fs) {
    return 0;
  }
  
  return 1;
}

uint8_t AF_SDLog::open_dir(char *path) {
  // Open root directory
  struct fat16_dir_entry_struct rootdirectory;

  fat16_get_dir_entry_of_root(fs, &rootdirectory);
  dd = fat16_open_dir(fs, &rootdirectory);
  if(!dd) {
    return 0;
  }
  return 1;
}


uint8_t find_file_in_dir(struct fat16_fs_struct* fs, struct fat16_dir_struct* dd, const char* name, struct fat16_dir_entry_struct* dir_entry)
{
    while(fat16_read_dir(dd, dir_entry))
    {
      if(strcmp(dir_entry->long_name, name) == 0)
        {
	  fat16_reset_dir(dd);
	  return 1;
        }
    }
    
    return 0;
}

struct fat16_file_struct* open_file_in_dir(struct fat16_fs_struct* fs, struct fat16_dir_struct* dd, const char* name)
{
    struct fat16_dir_entry_struct file_entry;
    if(!find_file_in_dir(fs, dd, name, &file_entry)) {

      //Serial.println("File not found");

        return 0;
    }
    return fat16_open_file(fs, &file_entry);
}


File AF_SDLog::open_file(char *name) {
  return open_file_in_dir(fs, dd, name);
}


uint8_t AF_SDLog::create_file(char *name) {
  struct fat16_dir_entry_struct file_entry;
  return fat16_create_file(dd, name, &file_entry);
}

/*
uint8_t AF_SDLog::seek_file(File fd, int32_t *offset, uint8_t whence) {
  return  fat16_seek_file(fd, offset, whence);
}*/


uint8_t AF_SDLog::write_file(File f, uint8_t *buff, uint8_t siz) {
  return fat16_write_file(f, buff, siz);
}



void AF_SDLog::close_file(File f) {
   fat16_close_file(f);
}
