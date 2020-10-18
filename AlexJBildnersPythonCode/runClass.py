from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from Setup import *
import random
import copy

def getInfo():
    checkAttendance = input("Type 'y' to check attendance, else 'n'")
    classMode = input("Type 'd' for discussion, 'l' for lecture")
    discussionBool = input("Type 'y' for discussion mode enabled, else type 'n'")
    testMode = input("Type 'y' for test mode, else type 'n'")
    makeTables = input("Type the number of students you want at each table if you would like the program to make tables for you, else type 'n'")
    return [checkAttendance , classMode , discussionBool , testMode , makeTables]

def checkAttendance(courseName, studentsPresent):
    ret = True
    missingStudents = []

    for student in courseRosters[courseName]:
        if student not in studentsPresent:
            ret = False
            missingStudents.append(student)
    return (ret, missingStudents)

def makeTables(courseName, num):
    studentRosterCopy = copy.copy(courseRosters[courseName])
    #numTables = len(studentRosterCopy) // num + 1 if len(studentRosterCopy) % num != 0 else len(studentRosterCopy) // num
    random.shuffle(studentRosterCopy)
    ret, temp, c = [], [], 0
    for i, student in enumerate(studentRosterCopy):
        temp.append(student)
        c += 1
        if c == num:
            ret.append(temp)
            c = 0
            temp.clear()
    if c != 0:
        ret.append(temp)
    return ret


def populateClass(classMode, discussionBool, testMode, makeTables): #implement this
    pass









