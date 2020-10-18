from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request


data = dict()  # this dictionary stores teacher names in a tuple as the key (firstName, lastName) and courses taught in a list as the values
courseRosters = dict()

def createCourse(courseName, courseSection, courseHeading, courseDescription, roomNumber, ownerID, courseState, students, service):
    course = {
        'name': courseName,
        'section': courseSection,
        'descriptionHeading': courseHeading,
        'description': courseDescription,
        'room': roomNumber,
        'ownerId': ownerID,
        'courseState': courseState
    }
    course = service.courses().create(body=course).execute()
    #print('Course created: %s %s' % (course.get('name'), course.get('id')))
    courseRosters[courseName] = students
    return course

def getStudents(course):
    return courseRosters[course]

def updateStudents(course, newStudents):
    courseRosters[course] = newStudents
    return

def getCourseDetails(course_id, service):
    course = service.courses().get(id=course_id).execute()
    return ('Course "{%s}" found.' % course.get('name'))

def getCoursesDetails(service):
    courses = []
    page_token = None

    while True:
        response = service.courses().list(pageToken=page_token, pageSize=100).execute()
        courses.extend(response.get('courses', []))
        page_token = response.get('nextPageToken', None)
        if not page_token: break

    ret = ""
    if not courses:
        print('No courses found.')
        return None
    else:
        ret += 'Courses:'
            for course in courses:
                ret += "\n" + course.get('name') + " " + course.get('id')
         return ret

def updateCourse(course_id, service, changes):
    course = dict()
    for val in changes:
        course[val[0]] = val[1]
    course = service.courses().patch(id=course_id, updateMask='section,room', body=course).execute()
    #print('Course "%s" updated.' % course.get('name'))
    return

def getNumTeachers():
    return len(data)

def getTeacherList():
    return list(data.keys())

def getCoursesOf(teacher):
    return data[teacher]

def clearData():
    data.clear()
    return

def clearTeacher(teacher):
    data[teacher] = None
    return

def deleteTeacher(teacher):
    del data[teacher]
    return

def addTeacher(firstName, lastName):
    self.addTeacher(firstName, lastName, None)
    return

def addTeacher(lastName, firstName, courses):
    data[(lastName, firstName)] = courses
    return

def addClass(teacher, course):
    data[teacher].append(course)
    return

def addClasses(teacher, courses):
    data[teacher] = data[teacher] + courses
    return

def getTeacherFor(course):
    for teacher in data:
        if course in data[teacher]: return teacher
    return ("Course Not Found", "")






