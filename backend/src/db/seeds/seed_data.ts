import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

  // Clear existing data
  await knex("epr_records").del();
  await knex("enrollments").del();
  await knex("courses").del();
  await knex("users").del();

  /* ---------------- USERS ---------------- */

  const users = [
    {
      id: "10000000-0000-0000-0000-000000000001",
      name: "System Admin",
      email: "admin@skynet.com",
      role: "admin"
    },

    {
      id: "20000000-0000-0000-0000-000000000001",
      name: "Rahul Sharma",
      email: "rahul@skynet.com",
      role: "instructor"
    },
    {
      id: "20000000-0000-0000-0000-000000000002",
      name: "Anita Kapoor",
      email: "anita@skynet.com",
      role: "instructor"
    },

    {
      id: "30000000-0000-0000-0000-000000000001",
      name: "Alex Kumar",
      email: "alex@skynet.com",
      role: "student"
    },
    {
      id: "30000000-0000-0000-0000-000000000002",
      name: "Maria Fernandes",
      email: "maria@skynet.com",
      role: "student"
    },
    {
      id: "30000000-0000-0000-0000-000000000003",
      name: "Ravi Patel",
      email: "ravi@skynet.com",
      role: "student"
    },
    {
      id: "30000000-0000-0000-0000-000000000004",
      name: "Sara Khan",
      email: "sara@skynet.com",
      role: "student"
    }
  ];

  await knex("users").insert(users);

  /* ---------------- COURSES ---------------- */

  const courses = [
    {
      id: "40000000-0000-0000-0000-000000000001",
      name: "CPL Integrated",
      license_type: "CPL",
      total_required_hours: 200
    },
    {
      id: "40000000-0000-0000-0000-000000000002",
      name: "PPL Course",
      license_type: "PPL",
      total_required_hours: 50
    }
  ];

  await knex("courses").insert(courses);

  /* ---------------- ENROLLMENTS ---------------- */

  const enrollments = [
    {
      id: "50000000-0000-0000-0000-000000000001",
      student_id: "30000000-0000-0000-0000-000000000001",
      course_id: "40000000-0000-0000-0000-000000000001",
      start_date: "2025-01-01",
      status: "active"
    },
    {
      id: "50000000-0000-0000-0000-000000000002",
      student_id: "30000000-0000-0000-0000-000000000002",
      course_id: "40000000-0000-0000-0000-000000000001",
      start_date: "2025-01-10",
      status: "active"
    },
    {
      id: "50000000-0000-0000-0000-000000000003",
      student_id: "30000000-0000-0000-0000-000000000003",
      course_id: "40000000-0000-0000-0000-000000000002",
      start_date: "2025-02-01",
      status: "active"
    },
    {
      id: "50000000-0000-0000-0000-000000000004",
      student_id: "30000000-0000-0000-0000-000000000004",
      course_id: "40000000-0000-0000-0000-000000000002",
      start_date: "2025-02-15",
      status: "active"
    }
  ];

  await knex("enrollments").insert(enrollments);

  /* ---------------- EPR RECORDS ---------------- */

  const eprs = [
    {
      id: "60000000-0000-0000-0000-000000000001",
      person_id: "30000000-0000-0000-0000-000000000001",
      evaluator_id: "20000000-0000-0000-0000-000000000001",
      role_type: "student",
      period_start: "2025-01-01",
      period_end: "2025-03-01",
      overall_rating: 4,
      technical_skills_rating: 4,
      non_technical_skills_rating: 5,
      remarks: "Strong technical knowledge and excellent communication.",
      status: "submitted"
    },
    {
      id: "60000000-0000-0000-0000-000000000002",
      person_id: "30000000-0000-0000-0000-000000000002",
      evaluator_id: "20000000-0000-0000-0000-000000000002",
      role_type: "student",
      period_start: "2025-02-01",
      period_end: "2025-04-01",
      overall_rating: 3,
      technical_skills_rating: 3,
      non_technical_skills_rating: 4,
      remarks: "Improving steadily but needs more flight practice.",
      status: "draft"
    }
  ];

  await knex("epr_records").insert(eprs);

}