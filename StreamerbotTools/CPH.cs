namespace StreamerbotTools
{
    /// <summary>
    /// Methods from CPH to avoid build errors.
    /// </summary>
    public static class CPH
    {
        /// <summary>
        /// Set local argument
        /// </summary>
        /// <param name="argumentName"></param>
        /// <param name="argumentValue"></param>
        public static void SetArgument(string argumentName, object argumentValue)
        {
            // No-op
        }

        /// <summary>
        /// Get Global variable
        /// </summary>
        /// <param name="varName"></param>
        /// <param name="persisted"></param>
        public static T GetGlobalVar<T>(string varName, bool persisted = true)
        {
            return default;
        }

        /// <summary>
        /// Set Global variable
        /// </summary>
        /// <param name="varName"></param>
        /// <param name="value"></param>
        /// <param name="persisted"></param>
        public static void SetGlobalVar(string varName, object value, bool persisted)
        {
            // No-op
        }
    }
}