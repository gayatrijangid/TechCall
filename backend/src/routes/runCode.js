import express from "express";

const router = express.Router();

router.post("/", (req, res) => {

    try {

        const { code } = req.body;

        let output = "";

        const originalLog = console.log;

        console.log = (...args) => {

            output += args.join(" ") + "\n";

        };

        eval(code);

        console.log = originalLog;

        res.json({
            output
        });

    }
    catch(error){

        res.json({
            output: error.toString()
        });

    }

});

export default router;