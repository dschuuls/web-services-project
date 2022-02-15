const iCal = require('ical');
const { JSDOM } = require('jsdom');

const COURSE_LIST_URL = "https://www3.hs-esslingen.de/qislsf/rds?state=verpublish&publishContainer=stgPlanList&navigationPosition=lectures%2CcurriculaschedulesList&breadcrumb=curriculaschedules&topitem=lectures&subitem=curriculaschedulesList";

module.exports = {
    getCoursesList: async function(searchTerm) {
        return await fetchCoursesList(false, searchTerm);
    },
    getCourseDetails: async function(courseId) {
        return await fetchCourseDetails(courseId);
    },
    getCourseLectures: async function(courseId, dateString, searchTerm) {
        return await fetchCourseLectures(courseId, dateString, searchTerm);
    }
};

async function fetchCoursesList(includeUrl, searchTerm) {
    return new Promise ((resolve) => {
        const options = {
            referrer: "https://www3.hs-esslingen.de",
            includeNodeLocations: true,
            storageQuota: 10000000
        };
        JSDOM.fromURL(COURSE_LIST_URL, options).then(dom => {
            let result = [];
            const selector = "#wrapper > div.divcontent > div.content_max_portal_qis > table > tbody";
            const nodeList = dom.window.document.querySelector(selector).childNodes;
            nodeList.forEach(node => {
                if (node.nodeType === 1) {
                    let course = {
                        courseId: node.textContent.trim()
                    };
                    if (includeUrl) {
                        course.scheduleUrl = node.childNodes.item(5).childNodes[1].attributes["href"].value;
                    }
                    if (searchTerm === undefined) {
                        result.push(course);
                    }
                    else if (course.courseId.includes(searchTerm)) {
                        result.push(course);
                    }
                }
            });
            resolve(result);
        });
    });
}

async function fetchCourseDetails(courseId) {

    const coursesList = await fetchCoursesList(true);
    const reqCourse = coursesList.find(course => course.courseId === courseId);
    if (reqCourse === undefined) return Promise.reject(3001);
    else return reqCourse;
}

async function fetchCourseLectures(courseId, dateString, searchTerm) {

    const dateRegEx = /\b[0-9]{4}-[0-9]{2}-[0-9]{2}\b/;
    const dateStringFilter = dateString !== undefined && dateString.match(dateRegEx);

    if (dateString !== undefined && !dateStringFilter) return Promise.reject(3011);

    const searchTermFilter = searchTerm !== undefined;
    const coursesList = await fetchCoursesList(true);
    const reqCourse = coursesList.find(course => course.courseId === courseId);

    if (reqCourse === undefined) return Promise.reject(3001);

    const calendarUrl = await fetchCalendarUrl(reqCourse.scheduleUrl);

    if (calendarUrl === undefined) return Promise.reject(3022);

    var lectures = await parseCalendar(calendarUrl);

    if (lectures.length === 0) return Promise.reject(3023);

    if (searchTermFilter) lectures = filterWithSearchTerm(lectures, searchTerm);
    if (dateStringFilter) lectures = filterWithDateString(lectures, dateString);

    return lectures;
}

function filterWithSearchTerm(lectures, searchTerm) {
    return lectures.filter(lecture => {
        return lecture.name.includes(searchTerm);
    });
}

function filterWithDateString(lectures, dateString) {
    return lectures.filter(lecture => {
        const filtered = lecture.dates.filter(date => {
            return date.myDate() === dateString;
        });
        return filtered.length > 0;
    });
}

async function fetchCalendarUrl(courseUrl) {
    return new Promise ((resolve) => {
        const options = {
            referrer: "https://www3.hs-esslingen.de",
            includeNodeLocations: true,
            storageQuota: 10000000
        };
        JSDOM.fromURL(courseUrl, options).then(dom => {
            const selector = "#wrapper > div.divcontent > div.content_max > form > table:nth-child(3) > tbody > tr > td:nth-child(1) > a";
            const node = dom.window.document.querySelector(selector);
            const url = node.attributes["href"].value;
            resolve(url);
        });
    });
}

async function parseCalendar(calendarUrl) {
    return new Promise((resolve) => {
        iCal.fromURL(calendarUrl, {}, function(err, data) {
            let result = [];
            for (let key in data) {
                if (data.hasOwnProperty(key) && data[key].type === "VEVENT") {
                    const event = data[key];
                    let lecture = {
                        name: event.summary,
                        location: event.location.split(" - ")[1]
                    };
                    if (event.hasOwnProperty("rrule")) {
                        if (event.hasOwnProperty("exdate")) {
                            lecture.dates = event.rrule.all().filter(date => {
                                const dateString = date.myDateTime();
                                return event.exdate.val.indexOf(dateString) < 0;
                            });
                        }
                        else {
                            lecture.dates = event.rrule.all();
                        }
                    }
                    else {
                        lecture.dates = [ event.start ];
                    }
                    result.push(lecture);
                }
            }
            resolve(result);
        });
    });
}

// ===== helper functions =====

Date.prototype.myDate = function() {
    const MM = this.getMonth() + 1; // getMonth() is zero-based
    const dd = this.getDate();

    return [this.getFullYear(),
        (MM>9 ? '' : '0') + MM,
        (dd>9 ? '' : '0') + dd
    ].join('-');
};

Date.prototype.myDateTime = function() {
    const MM = this.getMonth() + 1; // getMonth() is zero-based
    const dd = this.getDate();
    const HH = this.getHours();
    const mm = this.getMinutes();

    return [this.getFullYear(),
        (MM>9 ? '' : '0') + MM,
        (dd>9 ? '' : '0') + dd,
        "T",
        (HH>9 ? '' : '0') + HH,
        (mm>9 ? '' : '0') + mm
    ].join('');
};