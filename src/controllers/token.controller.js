import Token from "../models/token.model.js";

export const createToken = async (req, res) => {
  try {
    const token = await Token.create({
      tokenPrice: req.body.tokenPrice,
      tokenVolume: 0,
      tokenPriceHistory: [
        {
          tokenPrice: req.body.tokenPrice,
        },
      ],
    });

    res.status(201).send({
      status: "success",
      data: token,
      message: "Token created successfully",
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

export const updateTokenValue = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId);

    if (!token) {
      return res.status(404).send({
        status: 400,
        message: "Invalid Token ID",
      });
    }

    token.tokenPrice = req.body.tokenPrice;
    token.tokenPriceHistory.push({
      tokenPrice: token.tokenPrice,
    });

    token.markModified("tokenHistory");
    await token.save();

    res.status(200).send({
      status: "success",
      data: token,
      message: "Token updated successfully",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateTokenVolume = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId);

    if (!token) {
      return res.status(404).send({
        status: 400,
        message: "Invalid Token ID",
      });
    }

    token.tokenVolume += req.body.tokenVolume;

    token.tokenVolumeHistory.push({
      tokenPrice: token.tokenPrice,
      tokenVolume: token.tokenVolume,
    });

    token.markModified("tokenHistory");

    await token.save();

    res.status(200).send({
      status: "success",
      data: token,
      message: "Token volume updated successfully",
    });
  } catch (error) {}
};

export const getToken = async (req, res) => {
  try {
    const token = await Token.find();

    if (!token) {
      return res.status(404).send({
        status: 400,
        message: "Invalid Token ID",
      });
    }

    res.status(200).send({
      status: "success",
      data: token,
      message: "Token retrieved successfully",
    });
  } catch (error) {
    res.status(500).send(err);
  }
};

export const shrinkTokenVolume = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId);

    if (!token) {
      return res.status(404).send({
        status: 400,
        message: "Invalid Token ID",
      });
    }

    if (token.tokenVolume < req.body.tokenVolume) {
      token.tokenVolume = 0;

      token.tokenVolumeHistory.push({
        tokenPrice: token.tokenPrice,
        tokenVolume: token.tokenVolume,
      });

      token.markModified("tokenHistory");

      await token.save();

      return res.status(200).send({
        status: "success",
        data: token,
        message: "Token volume updated successfully",
      });
    }

    token.tokenVolume -= req.body.tokenVolume;

    token.tokenHistory.push({
      tokenPrice: token.tokenPrice,
      tokenVolume: token.tokenVolume,
    });

    token.markModified("tokenHistory");

    await token.save();

    res.status(200).send({
      status: "success",
      data: token,
      message: "Token volume updated successfully",
    });
  } catch (error) {
    res.status(500).send(err);
  }
};

export const updateTokenPerTon = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId);
    if (!token) {
      return res.status(404).send({
        status: 400,
        message: "Invalid Token ID",
      });
    }

    token.tokenPerTon = req.body.tokenPerTon;
    token.markModified("tokenPerTon");
    await token.save();

    res.status(200).send({
      status: "success",
      data: token,
      message: "Token updated successfully",
    });
  } catch (error) {
    res.status(500).send(err);
  }
};

export const updateTokenLimit = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId);
    if (!token) {
      return res.status(404).send({
        status: 400,
        message: "Invalid Token ID",
      });
    }

    token.tokenLimit = req.body.tokenAmountLimit;
    token.markModified("tokenLimit");
    await token.save();

    res.status(200).send({
      status: "success",
      data: token,
      message: "Token updated successfully",
    });
  } catch (error) {
    res.status(500).send(err);
  }
};
