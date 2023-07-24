/*
Copyright (c) 2023 zephsinx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using System;
using System.Collections.Generic;

namespace StreamerbotTools.SnapLevelCounter
{
    public class SetLevelSublevelCommand
    {
        // Remove this line before use in Streamer.bot
        private readonly Dictionary<string, object> args;

        public bool Execute()
        {
            try
            {
                args.TryGetValue("command", out object command);
                args.TryGetValue("input0", out object input0);
                args.TryGetValue("input1", out object input1);
                if (input0 == null || input1 == null)
                {
                    string commandString = command?.ToString() ?? "!command";
                    CPH.SetArgument("errorMsg", $"Provide both level and sublevel in the format '{commandString} level_value sublevel_value'. e.g. '{commandString} 50 3'");
                    return true;
                }

                int.TryParse(input0.ToString(), out int level);
                int.TryParse(input1.ToString(), out int sublevel);
                string errorMsg = ValidateInputs(level, sublevel);
                if (!string.IsNullOrWhiteSpace(errorMsg))
                {
                    CPH.SetArgument("errorMsg", errorMsg);
                    return true;
                }

                CPH.SetArgument("level", level);
                CPH.SetArgument("sublevel", sublevel);
                CPH.SetGlobalVar("global_level", level, true);
                CPH.SetGlobalVar("global_sublevel", sublevel, true);
                return true;
            }
            catch (Exception ex)
            {
                CPH.SetArgument("exception", ex);
                return true;
            }
        }

        private static string ValidateInputs(int level, int sublevel)
        {
            if (level < 1)
                return "Level must be a number greater than 0";
            if (sublevel < 0 || sublevel > 6)
                return "Sublevel must be a number between 0 and 6";
            return string.Empty;
        }
    }
}