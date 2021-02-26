#!/usr/bin/python


class HalException(Exception):
    pass

class HardwareException(HalException):
    """
    A generic hardware exception.
    """
    pass

class ModuleException(HalException):
    """
    A generic hal module exception.
    """
    pass

class GUIException(HalException):
    """
    A generic hal gui exception.
    """
    pass
