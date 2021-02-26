#!/usr/bin/python
# Olympus IX2-UCB

import time

import hardware.serial.RS232 as RS232

## IX2UCB
#
# This class encapsulates control of a Olympus filter wheel that
# is run by a IX2UCB controller. Communication is done via RS-232
#
#
class IX2UCB(RS232.RS232):

    ## __init__
    #
    # @param port (Optional) The com port, defaults to "COM4".
    # @param baud (Optional) The baud rate, defaults to 9600.
    #
    def __init__(self, port = "COM4", baud = 9600):
        self.position = 0
        try:
            # open port
            RS232.RS232.__init__(self, port, None, baud, "\r", 0.05)

            # verify that we can talk to the filter wheel
            assert not(self.commWithResp("1LOG IN") == None)

        except:
            self.live = 0
            print "Failed to connect to the IX2-UCB controller at port", port

    ## amMoving
    #
    # @return True/False if the stage is moving.
    #
    def amMoving(self):
        resp = self.commWithResp("1MU?")
        if resp:
            position = resp[:-1]
            status = position.split(" ")[-1]
            if status == "X":
                return True
            else:
                return False
        else:
            print "IX2-UCB: Failed query motion status"
            return False

    ## getPosition
    #
    # @return The current position of the filter wheel.
    #
    def getPosition(self):
        resp = self.commWithResp("1MU?")
        if resp:
            position = resp[:-1]
            temp = position.split(" ")[-1]
            if temp == "X":
                print "IX2-UCB: Filter wheel is still moving"
                return 1
            else:
                try:
                    self.position = int(temp)
                    return self.position
                except:
                    print "IX2-UCB: Could not parse:", temp
                    return 1
        else:
            print "IX2-UCB: Failed to get filter wheel position"
            return 1

    ## setPosition
    #
    # @param position The desired filter wheel position (1-6).
    #
    def setPosition(self, position):
        if (position != self.position):
            if (position < 1):
                position = 1
            if (position > 6):
                position = 6
            self.commWithResp("1MU " + str(position))
            self.position = position

#
# Testing
#

if __name__ == "__main__":
    ix2 = IX2UCB()

    print ix2.getPosition()
    ix2.setPosition(1)
    while ix2.amMoving():
        time.sleep(0.1)
    print ix2.getPosition()

    ix2.setPosition(3)
    while ix2.amMoving():
        time.sleep(0.1)
    print ix2.getPosition()

    ix2.setPosition(1)
