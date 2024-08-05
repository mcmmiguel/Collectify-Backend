import nodeServer from "./server";
import colors from 'colors';

const port = process.env.PORT || 4000;

nodeServer.listen(port, () => {
    console.log(colors.cyan.bold(`Server running in ${port}`));
})