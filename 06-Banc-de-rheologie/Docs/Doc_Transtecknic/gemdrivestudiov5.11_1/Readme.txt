November, 2015
Version 5.11

MINIMUM CONFIGURATION:
- Windows XP Service pack 2 operating system
- Microsoft .Net Framework v3.5 or v4.0 installed

RESTRICTION:
- For the Windows 7 professional 64 bit version, the service pack 1 must be 
  installed


HISTORY:
--------

Version 5.11
------------

- New version of the communication server (V4.4)
  => New dictionaries
  => New procedure to detect the installed boards for a given peripheral

- Management of Endat encoder.

- Correction in the sequence editor (format of outputs in the file SEQUENCE.TXT)

- Some corrections and improvements


Version 5.10
------------
- New version of the communication server (V4.3)
  => New dictionaries

- Mofification of the design for the Position Sensor parameters Window

- Addition of the RMS motor current value display in Device Control Window.


Version 5.9
-----------
- New version of the communication server (V4.2)
  => Improvement of the simulator regarding the servo loop gains calculation
     and the autotuning procedure.

- Correction of a problem to display several unsigned 32 bit objects


Version 5.8
-----------
- New version of the communication server (V4.1)
  => New dictionaries

- Correction of a problem regarding the information update in the Dialog Windows
  and the oscilloscope in case of connection/disconnection of the device.

- Management of the cogging torque compensation for devices which support this 
  function.


Version 5.7.25 (beta version)
--------------
- New version of the communication server (V4.0)
  => New EtherCAT driver

- Some corrections and improvements. 


Version 5.7.19 (beta version)
--------------
- Removal of the trademark symbol in order to avoid a display problem in 
  Chinese OS.


Version 5.7.18 (beta version)
--------------
- Management of the reset for the absolute encoder

- Possibility to select a 48 Vac user voltage for 230V and 400v drives

- Addition of new error and warning codes

- Some corrections and improvements.


Version 5.7.14 (beta version)
--------------

- New version of the communication server (V3.9)
  => New dictionaries

- Addition of the servo loop gain calculation procedure (used for 
  sensorless motors)

- Management of Tamagawa® encoders

- Addition of new error and warning codes

- AOK output management in Basic Digital Outputs configuration

- Some corrections and improvements.


Version 5.7
-----------
- New version of the communication server (V3.8)
  => New dictionaries, 
  => Automatic installation of WinPcap,
  => Automatic detection of a network card on which a slave is connected 
     (only for EtherCAT communication).
  => New IXXAT driver used to manage the USB-to-CAN V2 adaptor

- Several improvements in the oscilloscope module to take into account all 
  the device limitations.

- Modification of the ergonomics for the "Position Sensor" window 

- Some corrections and improvements.


Version 5.6.1
-------------
- Correction of a text display problem in the "Position Sensor" window, 
  which could lead to a confusion.


Version 5.6
-----------

- New version of the communication server (V3.7 => New dictionaries, 
  correction in the CANopen IXXAT peripheral management, improvement 
  in USB management).

- Addition of the homing methods description in the help of the sequence
  editor.

- Correction of a problem in the procedure used for writing a file object by 
  object, When an object was written in lower case into the file.

- Addition of a button for loading a CAM file into the master-slave parameter
  window.

- Addition of a message indicating that a file will be renamed in DRIVEPAR.TXT
  or in USER_PAR.TXT before writing it into the drive memory.

- Various corrections and improvements.


Version 5.5
-----------

- New version of the communication server (V3.5 => New dictionaries and some
  corrections in the simulator)

- Addition of a cam editor

- Taking into account of a cam sequence in the sequence editor

- Correction in the template initialization procedure

- Addition of a window used for selecting the speed on the CAN bus

- Addition of the possibility to cancel the exit when the user wants to
  quit the software and if some parameters have changed 

- Oscilloscope: In the loading procedure from the .osc file, the channels not 
  present in the file are switched off in the oscilloscope interface.

- Oscilloscope: In stand-alone mode only, the interface is initialized with the 
  parameters read in the device in order to retrieve the same configuration as
  before the trigger event.

- Oscilloscope: Modification of the display configuration windows in order to allow 
  the display of a single bit, and to change this bit number without a new transfer.

- Modification of the power supply configuration window for separating the user 
  voltage selection and the low voltage thresholds adjustment.

- Addition of the low-pass filter management in the stepper input configuration window.

- Improvement of the device node-id configuration window. Addition of the serial 
  number and the physical slot displays (for the multi-axis version).
 
- Various corrections and improvements for all modules.


Version 5.4.2
-------------

- Bug correction regarding the analysis of template file


Version 5.4
-----------

- New version of the communication server (V3.4)

- Integration of the service pack 3 of XML4 parser into the software package in 
  order to solve a compatibility problem with Windows7 64 bit.

- New signal units in oscilloscope

- New warning code

- Various corrections and improvements


Version 5.3
-----------

- New version of the communication server (V3.3)
	=> Modification of the IXXAT drivers installation
	=> Compatibility with Windows 8

- Correction in the backup procedure from the drives regarding the date 
  memorization.

- Compatibility with Windows 8

- Correction of a problem in the drive current limitation procedure (only in 
  simulation)


Version 5.2
-----------

- New version of the communication server (V3.2) with new IXXAT drivers

- Display of the latest backup date and time in the Drive Parameters window.

- Management of the "HES only" feedback sensor

- Compatibility with the Microsoft Framework 4.0

- Possibility to select 34 Vac for the user voltage.

- Various corrections and improvements


Version 5.1
-----------

- New version of the communication server (V3.1) with new drivers

- Corrections in the sequence editor

- Improvement of the Power Supply window


Version 5.0
-----------

- New version of the communication server (V3.0) with device simulator

- New presentation of the dialog window module

- New features in the oscilloscope module (real-time display of the signal
  for the trigger channel)

- Various corrections and improvements in all modules.


Version 4.8
-------------

- New error codes.

- Addition of the power supply and braking resistor management


Version 4.7.4
-------------

- New version of the communication server (V2.1)

- Various corrections and improvements.


Version 4.7.1
-------------

- New version of the communication server (V2.0)

- Taking into account the multi-core processor in the firmware update procedure.

- Management of the multi-axis devices.

- Various corrections and improvements.


Version 4.6.2
-------------

- Addition of the Mavilor XtraForsPrime 230 V motors and corrections in the 
  XtraForsPrime 400 V parameters.


Version 4.6.1
-------------

 - Correction in the customized dictionaries management.


Version 4.6
-----------

 - Modification of the device info. window in order to display additionnal
   information.
 - Taking into account the new drive range 400 V / 100 A

 - A level 2 user can now use the dialog window for reading parameters only

 - Addition of the possibility to copy the drive error list to the clipboard.

 - Addition of the speed following error management

 - Various corrections and improvements.


Version 4.5.1
-------------

 - Correction of a problem when simulating the addition of a new device into an 
   existing project.

 - Correction of a problem when reading path information in the Windows registry 
   with some versions of Window Seven.

 - Correction of the controller diagram picture
  

Version 4.5
-----------

- Multilingual software in english, french and german.

- Taking into account the user units in the sequence report printing.

- New error codes.

- Additional help display (accessible via F1 key) for all modules.

- Implementation of procedures in wizard mode for the operator guidance.

- The installation of IXXAT drivers is now optional.

- Various corrections and improvements.

 
Version 4.4.3
-------------

- Modification of the default configuration file in order to correct a problem 
  for a first installation in german.


Version 4.4.2
-------------

- Correction of a problem to display character strings in the Device Control 
  window.

- Change of the object used to display the Analog. Speed Ref. in the Device
  Control window.


Version 4.4
-----------

- New Drive communication server using the .NET environment.

- Modification of the file structure and the recordings in the Windows 
  registry in order to make the software usable by a user who does not have 
  administrator rights.

- Errors in red and information in green for the display of the information 
  messages.

- The new server version allows forcing the drive baudrate at the speed selected 
  by the user.

- Additional possibility to open the software by double-click on a project 
  file (.prj).

- Additional display of a "splashscreen" window when launching the main interface 
  with display of the actions executed during the start phase.

- Management of the SinCos track sensors.

- Fixed problem of the interface display after closing the software with a 
  minimized window.

- Multilingual installer (english, french and german).

- Additional parameter for the "pulses duty cycle" tolerance of the encoder 
  output.


Version 3.6
-----------

- Addition of the possibility to select the bandwidth before starting the current
  loop gains calculation procedure.

- Various corrections and improvements.


Version 3.5
-----------

- Addition of the asynchronous motors management

- Addition of a window for the CANopen external I/O module configuration.

- Additional possibility to select the file for saving a new motor in the motor 
  catalog window.

- Addition of a link to the quick start manual (pdf format) in the menu Infos

- Addition of the Position Limits configuration window.

- Various corrections and improvements.


Version 3.4
-----------

- The restoring procedure is aborted if the backup files do not contain at least 
  the DRIVEPAR.TXT file.

- Correction of the inversion between IN3 and IN5 in the template "Advanced 
  stepper emulation".
  IN3 is dedicated to the DIR function, and IN5 is dedicated to the PULSE function.


Version 3.3
-----------

- Correction of a bug for the input object selection of the "Master-slave" window.

- Addition of a message indicating that the parameters have been changed at the 
  software closing after a template selection.

- Removal of the pointer in the motor file list corresponding to the motor 
  memorized in the drive.

- Each motor file is divided into several parts in order to show the various motor 
  families.

- Addition of the motor file name displayed in the motor file list.

- A complementary decimal digit is displayed in the motors list for the kt and the 
  inertia.

- In the Position Sensor parameters window, addition of a warning message if the 
  position resolution is lower than 1000.

- Memorization of the last position used and sized for all the interfaces.

- Correction of the bug in the oscilloscope: the trigger type was modified after a 
  channel configuration change.


Version 3.2
-----------

- If a device is removed from the project, the pertaining directory of this device 
  is also deleted from the hard disk.

- Additional possibility to modify a device name in the context menu.

- When deleting or changing a device name, the confirmation message specifies 
  that this change cannot be cancelled.

- Directory deletion of drives added but not saved when quitting the 
  software, as well as of the temporary project file (.back).

- Bug correction regarding the detection of a device in Boot Manager mode.

- Correction of a bug that generated a capacity overshoot when the Factor 
  parameter of a Gearing sequence exceeded 32767.

- Improvement of the archiving and dearchiving procedures of a project.

- Improvement of the firmware update procedure. 

- Addition of buttons allowing stopping the Stepper emulation, IP and Gearing 
  modes in the Device Control windows.

- Correction of the bit reversal in the Exit Mode field of the Master Slave window.

- Decoding update of the signal units in the oscilloscope.

- The "restore" command is limited at the actually connected drives only.


Version 3.1
-----------

- Addition of the Gearing mode processing.

- Additional saving of the oscilloscope configuration and terminal files in the 
  project archiving.

- Bug correction of the current actions display in the "File Service" window, when 
  upgrading a firmware.

- Correction of a bug that hindered the loading of user programs larger than 
  32 kB.

- In the "CAN configuration" window, addition of a button allowing exporting the 
  configuration into the clipboard.

- Various corrections and improvements.


Version 3.0
-----------

- When starting the software on the last project, the menus pertaining to the  
  project ("save project", "save project as...", "close project") are no more 
  disabled.

- When simulating a drive, the software does not propose anymore to save 
  the modified parameters when quitting the application.

- Correction of a problem when reading the objects "string of characters" 
  when the drive is simulated (example: "Device Infos" window).

- Modification of the operation descriptions for the field "Disable operation" 
  in the "Stop Operation" window.

- Correction of a problem when saving the motors in the catalog. This problem 
  was hindering the correct identification of the motor saved in the drive, if  
  it had a personal code.

- Addition of the possibility to use the COM ports 1 to 16. The port selection is 
  now made from a drop-down list in the "Communication Configuration" window.

- A hardware COM port is no more necessary when a drive simulation is required, 
  except if, in the project, some drives are simulated and others really connected.

- Modification of the communication server for improving the transfer times  
  when using a USB/serial link adapter.

- Addition of the Modulo configuration window.

- In the treeview, selection of a source program file by a sample click in 
  place of a double-click.

- Modification of error message: "Short-circuit fault" is replaced by "IGBT
  module error".

- Addition of the possibility to connect a device even if the library of
  extended dictionaries is not up to date. In this case, the most recent and 
  compatible dictionary is used.

- Various corrections and improvements 
  

Version 2.5
-----------

- Correction of a problem that hindered the display of the user program name
  in progress in the programming window.
 
- Correction of a bug in the sequence editor, that hindered the backup of 
  negative speeds.
 
- Corrected re-reading problem  of the "Free running" parameter in the 
  "Servo mode" window.
 
- Improvement of the protection against the writing of empty files in the 
  drive.
 
- Correction of a bug in the oscilloscope regarding the display for time basis
  multiples of 250 ms.
 
- Correction of a problem in the oscilloscope, that hindered the correct time
  basis re-reading in the stored files.
 
- In the oscilloscope, programming of the first sub-index value for the 
  "Receive/Transmit PDO mapping" objects, that indicates the number of mapped
  objects in the PDO.
 
- Corrected problem regarding the recovery of windows in the oscilloscope, 
  when option "Always on top" is active.
 
- Improved coherence of the data sent back by the server for a simulation 
  drive.
 
- Removal of the "Parameter files" window and creation of two different 
  windows: "Drive parameter files" and "User parameter files". The last one 
  is accessible in expert mode only.
 
- Additional forcing of the parameter backup before starting a backup 
  procedure, in order to make sure that the backup will occur with 
  up-to-date files.
 
- Modification of the image used for the backup representation, which 
  indicates at first a storage of the parametes in the flash memory before 
  starting the backup.
 
- Additional memorization of the modification of one or several parameters for
  each drive, with the possibility to start a backup (confirmed by the user) 
  before disconnection.
 
- When testing a program, the software resetted the client modules 
  (oscilloscope, terminal) in order to reset the object lists (parameters).
  Additional backup instruction for the project configuration on client 
  modules before this reset, in order to avoid loosing the current 
  configuration.
 
- In case of non-decoded error, only the non-decoded error or warning bits 
  will be displayed in the message.
 
- Correction of a problem in the programming part concerning the display of 
  a message indicating the impossibility to open the .PRG file.
 
- Improved coherence between the reader name and the pertaining directories 
  in the dialog box of a directory selection.


Version 2.4
-----------

- Modified ending of the firmware update procedure in "File Service", in order
  to avoid the error message "File reading error" after disconnecting and 
  re-connecting the drive.
 
- Modified reading and writing procedures of a parameter in the drive. If the
  parameter is unknown, an error message is displayed but the communication 
  is no more interrupted.
 
- Correction of the value inversion between the 24 V logic option and the 
  opto-isolated 24 V in the "Stepper input configuration" window.
 
- Sequence editor:
   -> Addition of controls and limitations in relation with the maximum
      authorized number of sequences for the connected drive.
   -> Sequence memorizing during the edition between two openings of 
      the editor.
 
- Addition of the possibility to import a .zip file containing template files.
 
- Correction of a bug that hindered the display of the parametrization 
  windows "Analog Output" and "Encoder Output".
 
- Added processing of the object short lists pertaining to the templates 
  and displayed in the terminal and in the oscilloscope.
 
- Addition of the possibility to modify the drive communication speed on 
  the serial port.
 
- Taking into account of the HES type encoders.
 
- Addition of the possibility to import a dictionary file in XML format or 
  of several dictionaries contained in a .zip file.
 
- Addition of the Templates filing and selection per product family.
 
- Correction of a problem that sometimes hindered to re-launch a bus scan.
 
- Correction of a problem that sometimes generated an execution error when
  exporting the configuration of a parametrization window in the MVT task.
 
- Correction of a bug that hindered the menu release during the restoring
  procedure of parameter files.
 
- Additional forbidding of the following procedures with a message display 
  if the motor is enabled:
   -> Restoring of the parameter files
   -> Modification of the position sensor parameters
   -> Selection of a new motor.
 
- Addition of a drive error reset before launching the parameter reading
  procedure of an Hiperface Encoder.


Version 2.3.1
-------------
- Addition of a button used for reset of the I/O configuration.

- Management of the start condition inputs (sequence mode) in the logical 
  inputs configuration window

- Addition of the minimum drive configuration test before applying a new 
  template.

- Modification of the analog inputs management in the I/O configuration
  window in expert mode.

- Addition of new templates

- Externalization of all pictures in order to reduce the size of the 
  executable.

- Fixed bug in the user motor catalog: The first record of the motor type 
  (rotative or linear) was incorrect.

- Modification of the server command progression information (bargraph in the
  toolbar area)

- Update of the position loop feedback object when a new motor parameter is 
  sent to the drive.

- Addition of the "SDcard" folder in the project archive file.

- Implementation of the "Backup" and "Restore" procedures for a single device or 
  for the complete application.

- Addition of the template information in the device tooltiptext, in the
  treeview.

- Oscilloscope: the screen color is now in accordance with the text color for a 
  print with ink economy option.

- Oscilloscope: Fixed bug on the digital trigger.

- Management of a new drive mode: Analog Torque Mode

- Fixed problem regarding the communication between the drive and a PC with a 
  Chinese version of Windows.

Version 2.2:
------------
- Multiaxis implementation for the oscilloscope

- Various corrections and improvements

Version 2.1:
------------
- Templates management for device configuration.

Version 2.0:
------------
1/ Main interface:
  - Fixed problem in "File Service", which inhibited any action 
    (reading, list, ...) if a previously opened file was still open.
 
  - Implementation of the "Save as..." function for projects.
 
  - Addition of the parameter file managing window with explanation diagrams.
 
  - Addition of the possibility to change the NodeID of a drive via the context
    menu.
 
  - Addition of the drive type display in the drive tooltiptext of the treeview.
  
  - Fixed problem in the SD card file generation: when launching the generation
    with the drive connected, the keyword "NODE" was not written in the
    GD1RUN.txt file, and the WRST at the end either.
  
  - Inhibiting of some parts of the software according to the modes and 
    functions supported by the drive.
  
  - The parametrization items are only created when connecting after the 
    reading of the functions supported by the drive.
  
  - Download of the object dictionary: addition of the number of indexes 
    and sub-indexes in the file header.
  
  - Motor files management: the feedback offset is now mentioned in electrical
    degrees in the motor files, which corresponds to the displayed value. 
    This value is converted in mechanical degrees before being sent to the 
    drive.
  
  - Implementation of a first simulator version.
  
  - "Servo mode" window: addition of the Control Word and Status Word display,
    and possibility to change the Control Word value.
  
  - Reset of the speed input command if the Quick Stop (protection) 
    is selected.
  
  - Modification of the Device Control window for the selecting the various 
    operation modes in a list. 
  
  - For all modules: taking into account of additional plug-ins 
    (EtherCAT, ...).
  
  - Main interface: use of a configuration file in text format like the other
    modules.
  
  - Modification communication configuration window for selecting the node
    numbers individually or by range (same for oscilloscope and terminal).
  
  - Addition of the speed display in rpm in the "Device control" window.
  
  - Addition of the bus scan function with drive detection and automatic 
    project definition.
  
  - In the SD card file generation, drives having neither an SD card reader 
    nor file system.
  
  - Possibility to enter/display the speed input command in user units or 
    rpm in the "Device control" window.
  
  - Possibility of the drive firmware update in the "File service" 
    window.
  
  - Possibility of displaying additional status on the logic outputs and of 
    controlling addition functions via the logic inputs.
  
  - Addition of the drive bus status in the CAN configuration window.
  
  - Modification of the auto-tuning window for displaying the operation mode
    selection.
  
  - Addition of the analog inputs configuration.
  
  - Modification of the motor thermal sensor management and memory-saving of
    the threshold values in kOhms in the motor files.
  
  - Removed use of the object dictionaries in the projects. Replaced by the
    library dictionaries.
  
  - Default use of the parameter files when adding a drive into the project 
    and use of this file for the simulation.
  
  - Integration of the IXXAT drivers in the package. These drivers, as well 
    as the drivers of the XML 4.0 pack are installed only if they are not yet 
    available on the PC.
  
  - Memorization into the configuration file of the speed unit for the Device 
    Control window (user unit or rpm).
  
  - Addition of a display configuration window ("Device Control" window 
    complete or reduced and status LEDs of the devices).
  
  - Display, in the "Device Control" window, only of the I/Os available in 
    the drive.

2/ Sequence editor:
   - Addition of the CTRL+C, CTRL+V, CTRL+X and CTRL+O processing in the
     edition.
   
   - Setting of default values when selecting an empty sequence.
   
   - The StartCond and EndCond parameters read in a file can have any digit 
     number between 0 and 1, but only the last 8 digits are displayed in the 
     editor.

3/ Oscilloscope: 
   - Addtion of the signal unit saving in the files.
   
   - The "Start" button is active again at the end of the acquisition and not 
     after the  end of the transfer.
   
   - Taking into account of the pre-trigger delay.
   
   - Addition of new LED colours:
      Red Led: Wait for trigger
      Green Led: Stopped
      Yellow Led: Data buffering in progress
      Purple Led: Wait for delay
   
   - Modification of the cursor management: value modifications by drag and 
     drop instead of left and right mouse button click. Same for the trigger.
   
   - Addition of a context menu allowing an auto-offset when clicking on 
     cursor T1.
   
   - Addition of a context menu allowing the analog trigger type adjustment 
     when clicking on the trigger line.
   
   - Addition of a context menu on the screen for lauching an auto-range.
   
   - Signal index and sub-index display in the signal name tooltip of the 
     window. 
  
   - Dotted display of the measuring cursors and of the triggering level.
  
   - Addition of the display resolution selection before the curve transfer.

- Oscilloscope and Terminal:
  Use of two configuration files: one standard configuration file located in 
  the installation directory and one project configuration file located in 
  each project's directory and containing the modules configuration memory 
  with regard to the project (drive list, selected objects, ...).


Version 1.4:
------------
- Taking into account additionnal encoder sensors in the "Position sensor
  configuration" window.

- Addition of a frame which indicates the current programmed position sensor 
  into the "Motor configuration" window.

- Display of the communication server type and speed in the status bar.

- Management and display of the drive warnings in the "Device Control" window.

- Addition of a version number for the Terminal and the Oscilloscope modules.

- Modification of the SD card files generation procedure: In online mode, 
  only the files present in the drive memory are saved.

- Improvement of the "Inputs/Outputs configuration window" to indroduce two
  programming levels (Basic and Advanced).

- Addition of information regarding the number of downloaded objects after a
  dictionary download.

Version 1.2:
------------
- Addition of the sequence editor

- Possibility to start a sequence using the device control window

- Management of the Encoder and analog output option

- Syntaxic colored editor.

- Mathematical functions added to the programming language.

- Improvement of the Oscilloscope interface (cursors, size of the pen, 
   trigger level, ...)

- Memorization of the last used axis in the Dialog window and Oscilloscope

Version 1.01h:
--------------
- Improvement of the SD card files generation. Now, all files are saved.

Version 1.01g:
--------------
- Addition of the menu "Project/open the directory".

- Allowing of the Cam digital parameters modification even if the cam 
  is disabled.
- Modification of the project creation proceduren in order to avoid having 
  several project files in the same directory.

Version 1.01f:
--------------
- Modification of the compiler

- Changing of the communication server name in order to customize the software

- Timing management when reading/writing files on drive, to avoid file 
  reading/writing errors.

Version 1.01e:
--------------
- Tab management for the various windows.

- Servo modes connection matrix implementation.

- Addition of the CAN configuration window.

- Possibility to switch on Homing profile and to start a homing procedure 
  from the Device Control window.

- Possibility to read information from an axis on the fieldbus by selecting 
  the NodeID and without opening a project (menu tools/Read axis information).

- Possibility to add or remove a source file for an axis by using the 
  contextual menu in the treeview.

- Modification of the versions display format in the Device info window.

- Separation of the digital cam configuration from the Inputs/Outputs 
  configuration window.

- In the windows "Inputs/Outputs", "Digital cams" and "CAN config.", addition 
  of a button for exporting the configuration into a source file.

- Reduction of the possible signal list in the oscilloscope.

- Addition of the skin folder into the application installation directory 
  (used to customize the software).

Version 1.01d:
--------------
- The passwd.dat file is no more removed when the program is uninstalled

- The last objects used in the Dialog Window are memorized.

- The SD card file generation has been added

- The terminal and oscilloscope modules are real-time informed in case of a
  project file modification.

Version 1.01c:
--------------
- The Inputs/Outputs item has been added in the treeview, in order to allow 
  the parametrization of the digital inputs, outputs and cams.


NOTES:
------

The software development is in progress and some functions may not be yet 
implemented.

In order to avoid execution errors and some random behaviours, it is mandatory 
to follow the instructions below:

1/ Uninstall all former versions of GemDriveStudio before installing the 
   new one.

2/ If an error of the AITOOL.DLL file occurs during the program installation, 
   choose "Ignore" and continue.

3/ Under WINDOWS Vista, it may be necessary to execute a first time each 
   module of the software (GemDriveStudio, GemDriveOscillo, GemDriveTerminal) 
   as administrator (click on the .exe file with the right mouse button and 
   select "Execute as administrator").
