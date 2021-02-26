#!/usr/bin/env python
"""
Wraps the pySerial library for RS232 communication.
"""

import serial
import time


class RS232(object):
    """
    The basic RS-232 communication object which is used by all the objects
    that communicate with their associated hardware using RS-232.
    """

    def __init__(self,
                 baudrate = None,
                 encoding = 'utf-8',
                 end_of_line = "\r",
                 port = None,
                 timeout = 1.0e-3,
                 wait_time = 1.0e-2,
                 **kwds):
        """
        port - The port for RS-232 communication, e.g. "COM4".
        timeout - The RS-232 time out value.
        baudrate - The RS-232 communication speed, e.g. 9800.
        end_of_line - What character(s) are used to indicate the end of a line.
        wait_time - How long to wait between polling events before it is decided 
                    that there is no new data available on the port. 
        """
        super().__init__(**kwds)
        self.encoding = encoding
        self.end_of_line = end_of_line
        self.live = True
        self.wait_time = wait_time
        try:
            self.tty = serial.Serial(port, baudrate, timeout = timeout)
            self.tty.flush()
            time.sleep(self.wait_time)
        except serial.serialutil.SerialException as e:
            print("RS232 Error:", type(e), str(e))
            self.live = False

    def commWithResp(self, command):
        """
        Send a command and wait (a little) for a response.
        """
        self.sendCommand(command)
        time.sleep(10 * self.wait_time)
        response = ""
        response_len = self.tty.inWaiting()
        while response_len:
            response += self.read(response_len)
            time.sleep(self.wait_time)
            response_len = self.tty.inWaiting()
        if len(response) > 0:
            return response

    def getResponse(self):
        """
        Wait (a little) for a response.
        """
        response = ""
        response_len = self.tty.inWaiting()
        while response_len:
            response += self.read(response_len)
            time.sleep(self.wait_time)
            response_len = self.tty.inWaiting()
        if len(response) > 0:
            return response

    def getStatus(self):
        """
        Return True/False if the port open and can we talk to the hardware.
        """
        return self.live

    def read(self, response_len):
        response = self.tty.read(response_len)
        return response.decode(self.encoding)

    def readline(self):
        response = self.tty.readline()
        return response.decode(self.encoding).strip()
        
    def sendCommand(self, command):
        self.tty.flush()
        self.write(command + self.end_of_line)

    def shutDown(self):
        """
        Closes the RS-232 port.
        """
        if self.live:
            self.tty = None

    def waitResponse(self, end_of_response = False, max_attempts = 200):
        """
        Waits much longer for a response. This is the method to use if
        you are sure that the hardware will respond eventually. If you
        don't set end_of_response then it will automatically be the
        end_of_line character, and this will return once it finds the
        first end_of_line character.
        """
        if not end_of_response:
            end_of_response = str(self.end_of_line)
        attempts = 0
        response = ""
        index = -1
        while (index == -1) and (attempts < max_attempts):
            response_len = self.tty.inWaiting()
            if response_len > 0:
                response += self.read(response_len)
            time.sleep(self.wait_time)
            index = response.find(end_of_response)
            attempts += 1
        return response

    def write(self, string):
        self.tty.write(string.encode(self.encoding))

    def writeline(self, string):
        msg = string + self.end_of_line
        self.tty.write(msg.encode(self.encoding))
