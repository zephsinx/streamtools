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

using System.Collections.Generic;

namespace StreamerbotTools.SnapLevelCounter
{
    public class SnapLevelCalculator
    {
        // Remove this line before use in Streamer.bot
        private readonly Dictionary<string, object> args;

        private const int MaxSublevel = 7;

        public bool Execute()
        {
            try
            {
                int.TryParse(this.args["level"]?.ToString(), out int level);
                // Ensure level is at least 1
                if (level < 1)
                    level = 1;

                int.TryParse(this.args["sublevel"]?.ToString(), out int sublevel);
                // Ensure sublevel is in range
                if (sublevel < 0 || sublevel >= MaxSublevel)
                    sublevel = 0;

                // Get value from arguments
                int.TryParse(this.args["value"]?.ToString(), out int value);
                (int newLevel, int newSublevel) = AddSubtractLevels(value, level, sublevel);
                // Set variables to be used on next subactions
                CPH.SetArgument("level", newLevel);
                CPH.SetArgument("sublevel", newSublevel);
            }
            catch (System.Exception ex)
            {
                CPH.SetArgument("exception", ex);
            }
            return true;
        }

        /// <summary>
        /// Calculate new level and sublevel based on provided value
        /// </summary>
        /// <param name = "value">Amount of cubes to add or remove from the sublevel to calculate the new level values</param>
        /// <param name = "startLevel">Current player level</param>
        /// <param name = "startSublevel">Current player sublevel</param>
        /// <remarks>
        /// Example: startLevel = 10, startSublevel = 4, value = 4.
        /// Result: level = 11, sublevel = 1
        /// </remarks>
        private static (int level, int sublevel) AddSubtractLevels(int value, int startLevel, int startSublevel)
        {
            if (value == 0)
            {
                return (startLevel, startSublevel);
            }

            int level = startLevel;
            int sublevel = startSublevel;

            int totalSublevels = (level - 1) * MaxSublevel + sublevel;
            totalSublevels += value;
            if (totalSublevels < 0)
            {
                level = 1;
                sublevel = 0;
            }
            else
            {
                level = totalSublevels / MaxSublevel + 1;
                sublevel = totalSublevels % MaxSublevel;
            }

            return (level, sublevel);
        }
    }
}