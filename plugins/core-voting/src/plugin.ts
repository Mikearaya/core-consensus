import { app } from "@arkecosystem/core-container";
import { Container } from "@arkecosystem/core-interfaces";
import { defaults } from "./defaults";
import { VotingManager } from "./voting";

export const plugin: Container.IPluginDescriptor = {
    pkg: require("../package.json"),
    defaults,
    alias: "voting",
    async register(container: Container.IContainer, options) {
        return new VotingManager();
    },
    async deregister(container: Container.IContainer, options) {
        return await app.resolvePlugin("voting").exit();
    },
};
