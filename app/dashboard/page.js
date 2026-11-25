"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

const menu = ["Dashboard", "Profile", "Attendance", "Results", "Timetable", "Fee Challan", "Notices"];

const attendance = [
  { course: "Programming Fundamentals", attended: 27, held: 30 },
  { course: "Calculus", attended: 24, held: 28 },
  { course: "English Composition", attended: 26, held: 29 },
  { course: "Introduction to Computing", attended: 22, held: 25 },
];

const results = [
  { course: "Programming Fundamentals", grade: "A-", points: "3.7" },
  { course: "Calculus", grade: "B+", points: "3.3" },
  { course: "English Composition", grade: "A", points: "4.0" },
  { course: "Introduction to Computing", grade: "B", points: "3.0" },
];

const timetable = [
  { day: "Monday", time: "09:00 - 10:30", course: "Programming Fundamentals", room: "Lab 2" },
  { day: "Tuesday", time: "11:00 - 12:30", course: "Calculus", room: "Room 14" },
  { day: "Wednesday", time: "09:00 - 10:30", course: "Introduction to Computing", room: "Room 8" },
  { day: "Thursday", time: "13:00 - 14:30", course: "English Composition", room: "Room 11" },
];

function subscribeToStudent(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getStudentSnapshot() {
  return window.localStorage.getItem("student");
}

function getServerStudentSnapshot() {
  return null;
}

function SectionTitle({ title, description }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>{headers.map((header) => <th key={header} className="px-5 py-3 font-semibold">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, index) => (
            <tr key={index} className="text-gray-700">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const savedStudent = useSyncExternalStore(subscribeToStudent, getStudentSnapshot, getServerStudentSnapshot);
  const student = useMemo(() => {
    if (!savedStudent) return null;
    try {
      return JSON.parse(savedStudent);
    } catch (error) {
      console.error("Could not read the saved student profile.", error);
      return null;
    }
  }, [savedStudent]);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const router = useRouter();

  useEffect(() => {
    if (!savedStudent || !student) {
      if (savedStudent && !student) localStorage.removeItem("student");
      router.push("/login");
    }
  }, [router, savedStudent, student]);

  const logout = () => {
    localStorage.removeItem("student");
    router.push("/login");
  };

  if (!student) return null;

  const cards = [
    { title: "CGPA", value: "3.45", section: "Results" },
    { title: "Attendance", value: "86%", section: "Attendance" },
    { title: "Fee Status", value: "Paid", section: "Fee Challan" },
  ];

  const content = {
    Dashboard: (
      <>
        <SectionTitle title="Student dashboard" description="A quick overview of your student portal." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={() => setActiveSection(card.section)}
              className="rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-700"
            >
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-green-700">{card.value}</p>
              <p className="mt-3 text-sm font-medium text-green-800">View details →</p>
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-5">
          <h3 className="font-semibold text-green-900">Welcome to your student portal</h3>
          <p className="mt-1 text-sm text-green-800">Choose a section from the menu to view your profile, attendance, results, timetable, fee information, and notices.</p>
        </div>
      </>
    ),
    Profile: (
      <>
        <SectionTitle title="My profile" description="Your student account information." />
        <div className="max-w-2xl divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white px-5 shadow-sm">
          {[["Student name", student.name || "Student"], ["Registration number", student.regNo || "Not provided"], ["Program", "Undergraduate"], ["Account", "Active"]].map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </>
    ),
    Attendance: (
      <>
        <SectionTitle title="Attendance" description="Attendance breakdown by course." />
        <DataTable
          headers={["Course", "Classes attended", "Classes held", "Attendance"]}
          rows={attendance.map((item) => [item.course, item.attended, item.held, `${Math.round((item.attended / item.held) * 100)}%`])}
        />
      </>
    ),
    Results: (
      <>
        <SectionTitle title="Results" description="Course grades and grade points." />
        <DataTable headers={["Course", "Grade", "Grade points"]} rows={results.map((item) => [item.course, item.grade, item.points])} />
      </>
    ),
    Timetable: (
      <>
        <SectionTitle title="Timetable" description="Your weekly class schedule." />
        <DataTable headers={["Day", "Time", "Course", "Room"]} rows={timetable.map((item) => [item.day, item.time, item.course, item.room])} />
      </>
    ),
    "Fee Challan": (
      <>
        <SectionTitle title="Fee challan" description="Current fee payment information." />
        <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="text-sm text-gray-500">Current semester fee</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">Paid</p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">Payment received</span>
          </div>
          <p className="mt-4 text-sm text-gray-600">This demo portal does not connect to a real payment system.</p>
          <button onClick={() => window.print()} className="mt-5 rounded-lg bg-green-800 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2">
            Print this page
          </button>
        </div>
      </>
    ),
    Notices: (
      <>
        <SectionTitle title="Notices" description="Updates for students." />
        <div className="max-w-2xl space-y-3">
          {[
            ["Welcome to UIMS", "Your student portal is ready to use.", "Today"],
            ["Check your timetable", "Review your weekly schedule before attending class.", "This week"],
            ["Keep your profile updated", "Make sure your registration details are correct.", "Reminder"],
          ].map(([title, description, date]) => (
            <article key={title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <span className="text-xs text-gray-500">{date}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </article>
          ))}
        </div>
      </>
    ),
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <aside className="bg-green-800 p-4 text-white md:min-h-screen md:w-60 md:shrink-0">
        <h1 className="mb-4 text-2xl font-bold md:mb-8">UIMS</h1>
        <nav aria-label="Student portal">
          <ul className="flex gap-2 overflow-x-auto md:flex-col md:space-y-1">
            {menu.map((item) => (
              <li key={item} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveSection(item)}
                  aria-current={activeSection === item ? "page" : undefined}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white ${
                    activeSection === item ? "bg-green-700 font-semibold" : "text-green-50"
                  }`}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 bg-white px-5 py-4 shadow-sm sm:px-8">
          <h2 className="font-semibold text-gray-800">Welcome, {student.name || "Student"}</h2>
          <button onClick={logout} className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Logout
          </button>
        </header>
        <section className="p-5 sm:p-8">{content[activeSection]}</section>
      </main>
    </div>
  );
}
