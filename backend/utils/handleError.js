import CustomError from "./CustomError.js";
import logger from "./logger.js";

const handleError = (error, res) => {
    if (!(error instanceof CustomError)) {
        logger.error(error?.stack || error);
        error = new CustomError("Please try again later", 500);
    }
    
    res.status(error.status).json({
        success: false,
        message: error.message
    });
}

export default handleError;