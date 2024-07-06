import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bankHistorySchema = new Schema(
  {
    tranferTime: {
      type: String,
    },
    amountReceived: {
      type: Number,
    },
    content: {
      type: String,
    },
    accountReceived: {
      type: String,
    },
    accountSent: {
      type: String,
    },
    trace: {
      type: Number,
    },
    fullContent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Bank_History", bankHistorySchema);
