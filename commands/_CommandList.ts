import { test } from "./test";
import { Command } from "./ICommand";
import { register } from "./register";
import { view } from "./view";
import { lfg } from "./lfg";

export const CommandList: Command[] = [
    test,
    register,
    view,
    lfg
];