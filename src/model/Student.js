import mongoose from "mongoose";
const { Schema, model } = mongoose;

const studentSchema = new Schema(
  {
    full_name: { type: String },
    student_code: { type: String },
    birthday: { type: String },
    gender: {
      type: String,
    },
    class: {
      type: String,
    },
    department: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Student", studentSchema);
