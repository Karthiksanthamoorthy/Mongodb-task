// Design database for Zen class programme
// users
// codekata
// attendance
// topics
// tasks
// company_drives
// mentors

// Find all the topics and tasks which are thought in the month of October
// Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020
// Find all the company drives and students who are appeared for the placement.
// Find the number of problems solved by the user in codekata
// Find all the mentors with who has the mentee's count more than 15
// Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020

// 1.To create Database
// use day2

// 2.To create and insert data for user
db.user.insertMany([
    {
      user_id: 1,
      name: "Avithran",
      email: "avithran@gmail.com",
    },
    {
      user_id: 2,
      name: "Arun",
      email: "arun@gmail.com",
    },
    {
      user_id: 3,
      name: "Dhamodharan",
      email: "dhamodharan@gmail.com",
    },
    {
        user_id: 4,
        name: "Karthik",
        email: "karthik@gmail.com",
      },
  ]);
  
  // 2.To create and insert data for codekata
  
  db.codekata.insertMany([
    {
      user_id: 1,
      codekata_title: "Array",
      codekata_problems: 1,
    },
    {
      user_id: 2,
      codekata_title: "Strings",
      codekata_problems: 2,
    },
    {
      user_id: 3,
      codekata_title: "Maths",
      codekata_problems: 3,
    },
  ]);
  
  // 3.To create and insert data for attendance
  
  db.attendance.insertMany([
    {
      user_id: 1,
      topic_id: 1,
      present: true,
    },
  
    {
      user_id: 2,
      topic_id: 2,
      present: true,
    },
    {
      user_id: 3,
      topic_id: 3,
      present: false,
    },
  ]);
  
  // 4.To create and insert data for topics
  
  db.topics.insertMany([
    {
      topic_id: 1,
      topic: "Html",
      topic_created: new Date("2022-03-28"),
    },
    {
      topic_id: 2,
      topic: "Css",
      topic_created: new Date("2022-04-06"),
    },
    {
      topic_id: 3,
      topic: "Javascript",
      topic_created: new Date("2022-04-10"),
    },
  ]);
  
  // 5.To create and insert data for task
  
  db.tasks.insertMany([
    {
      topic_id: 1,
      topic: "HTML",
      topic_date: new Date("2022-06-01"),
      submitted: true,
    },
    {
      topic_id: 2,
      topic: "CSS",
      topic_date: new Date("2022-06-06"),
      submitted: true,
    },
    {
      topic_id: 3,
      topic: "Javascript",
      topic_date: new Date("2022-06-16"),
      submitted: false,
    },
  ]);
  
  // 6.To create and insert data for mentor
  
  db.mentors.insertMany([
    {
      mentor_id: 1,
      mentor_name: "Rohit",
      mentor_email: "rohit@gmail.com",
      class_count: 30,
    },
    {
      mentor_id: 2,
      mentor_name: "Sriram",
      mentor_email: "sriram@gmail.com",
      class_count: 28,
    },
    {
      mentor_id: 3,
      mentor_name: "Venkat",
      mentor_email: "venkat@gmail.com",
      class_count: 26,
    },
  ]);
  
  // 7.To create and insert data for companydrive
  
  db.companydrives.insertMany([
    {
      user_id: 1,
      drive_date: new Date("2022-10-20"),
      company_name: "IBM",
    },
    {
      user_id: 2,
      drive_date: new Date("2022-10-24"),
      company_name: "Accenture",
    },
    {
      user_id: 3,
      drive_date: new Date("2022-10-29"),
      company_name: "Amazon",
    },
  ]);
  
  // 1.Find all the topics and tasks which are thought in the month of October
  db.tasks
    .find({
      $and: [
        { topic_date: { $lte: new Date("2022-10-20") } },
        { topic_date: { $gte: new Date("2022-10-30") } },
      ],
    })
    .pretty();
  
  db.topics
    .find({
      $and: [
        { topic_created: { $lte: new Date("2022-10-20") } },
        { topic_created: { $gte: new Date("2022-10-30") } },
      ],
    })
    .pretty();
  
  // 2.Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020
  
  db.companydrives
    .find({
      $and: [
        { drive_date: { $lte: new Date("2022-10-20") } },
        { drive_date: { $gte: new Date("2022-10-30") } },
      ],
    })
    .pretty();
  
  // 3.Find all the company drives and students who are appeared for the placement.
  db.companydrives.aggregate({
    $lookup: {
      from: "user",
      localField: "user_id",
      foreignField: "user_id",
      as: "company_drives",
      pipeline: [{ $project: { name: 1 } }],
    },
  });
  
  // 4.Find the number of problems solved by the user in codekata
  db.user.aggregate({
    $lookup: {
      from: "codekata",
      localField: "user_id",
      foreignField: "user_id",
      as: "Solved",
      pipeline: [{ $project: { codekata_problems: 1 } }],
    },
  });
  
  // 5.Find all the mentors with who has the mentee's count more than 15
  db.mentors.find({ class_count: { $gt: 15 } });
  
  // 6.Find the number of users who are absent and task is not submitted between 15 oct-2020 and 31-oct-2020(from and foreignField as same db collection )
  db.tasks
    .aggregate([
      {
        $lookup: {
          from: "attendance",
          localField: "topic_id",
          foreignField: "user_id",
          as: "attendance",
        },
      },
      {
        $match: { $and: [{ submitted: false }, { "attendance.present": false }] },
      },
    ])
    .pretty();
  