module.exports = {
    add: (req, res) => {
        const addNumbersRequest = req.swagger.params.addNumbersRequest.value;

        res.json({
            result: addNumbersRequest.a + addNumbersRequest.b
        });
    },

    sub: (req, res) => {
        const a = req.swagger.params.a.value;
        const b = req.swagger.params.b.value;

        res.json({
            result: a - b
        });
    }
};
