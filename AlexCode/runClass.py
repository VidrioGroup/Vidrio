from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from Setup import *
import random
import copy
import json
import js
import pure




def getInfo():
    courseName = input("Enter the name of the course you are beginning a lesson for ")
    checkAttendance = input("Type 'y' to check attendance, else 'n' ")
    classMode = input("Type 'd' for discussion, 'l' for lecture ")
    discussionBool = input("Type 'y' for discussion mode enabled, else type 'n' ")
    testMode = input("Type 'y' for test mode, else type 'n' ")
    makeTables = input("Type the number of students you want at each table if you would like the program to make tables for you, else type 'n' ")
    return [courseName , checkAttendance , classMode , discussionBool , testMode , makeTables]

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


def populateClass(courseName, checkAttendance1, classMode, discussionBool, testMode, makeTables1, studentsPresent):
    val1 = []
    if makeTables1 != 'n':
        val1 = makeTables(courseName, makeTables)
    val2 = []
    if checkAttendance1 == 'y':
        val2 = checkAttendance(courseName, studentsPresent)
    val3 = classMode
    val4 = discussionBool
    val5 = testMode
    ret = [val1, val2, val3, val4, val5]
    return json.JSONEncoder().encode(ret)

def getStudentsPresent():
    return pure.getStudents()


if __name__ == '__main__':
    values = getInfo()
    studentsPresent = getStudentsPresent()
    ret = populateClass(values[0], values[1], values[2], values[3], values[4], values[5], studentsPresent)
    print(ret)
    print(pure)










