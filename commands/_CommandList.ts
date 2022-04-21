import { test } from "./test";
import { Command } from "./ICommand";
import { register } from "./register";
import { view } from "./view";
import { lfg } from "./lfg";
import { settings } from "./settings";
import { subscribe } from "./subscribe";

export const CommandList: Command[] = [
    test,
    register,
    view,
    lfg,
    settings,
    subscribe
];