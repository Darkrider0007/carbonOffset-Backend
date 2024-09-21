import {
  calculatePercentageIncrease,
  calculatePercentageIncreaseProjects,
} from "../helpers/calculatePercentageIncrease.helper.js";
import Project from "../models/project.model.js";
import Token from "../models/token.model.js";
import User from "../models/user.model.js";

export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          userCount: "$totalUsers",
        },
      },
    ]);

    const totalProjects = await Project.aggregate([
      {
        $group: {
          _id: null,
          totalProjects: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          projectCount: "$totalProjects",
          _id: 0,
        },
      },
    ]);

    const allProjects = await Project.aggregate([
      {
        $match: {},
      },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          userCount: 1,
          status: 1,
          details: 1,
          image: 1,
        },
      },
    ]);

    const userDataByMonth = await User.aggregate([
      {
        $group: {
          _id: "$createdAt",
          totalUsers: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    let percentageUserIncrease = calculatePercentageIncrease(userDataByMonth);

    const projectByMonth = await Project.aggregate([
      {
        $group: {
          _id: "$createdAt",
          totalProjects: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);

    const projectDataByMonth =
      calculatePercentageIncreaseProjects(projectByMonth);

    return res.status(200).json({
      totalUsers: totalUsers[0].userCount,
      totalProjects: totalProjects[0].projectCount,
      allProjects: allProjects,
      percentageUserIncrease: percentageUserIncrease.percentageIncrease,
      userCountPerMonth: percentageUserIncrease.countByMonth,
      projectCountPerMonth: projectDataByMonth.percentageIncrease,
      projectDataByMonth: projectDataByMonth.countByMonth,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
