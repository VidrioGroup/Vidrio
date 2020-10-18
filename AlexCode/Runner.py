from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import quickstart
import Setup


def demo(service):
    students = ["Alex Bildner" , "Bennett Bierman" , "Emily Mittlemen" , "Colin Boccaccio" , "Andrew Smith" ,
                "John Appleseed" , "Mark Gold" , "James Hurley" , "Ben Johnson" , "Charles Williams" ,
                "Justin Miller" , "Carlos Jones" , "Luke Brown" , "Hugh Sanders" , "Wolf Sullivan" , "Allen Morgan"]

    course1 = Setup.createCourse("Honors US History", "C102", "Mr. Smith's Period 2 US History Course",
                 "In this course you will learn about US History from 1492 through the antebellum period", "106",
                 "me", None , students, service)

    Setup.addTeacher("Smith", "John", [course1])
    return


if __name__ == '__main__':
    s = quickstart.start()
    demo(s)
