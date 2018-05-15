﻿using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.ExceptionHandling;
using Serilog;
using webapi.Models;

namespace webapi.Extensibility
{
    /// <summary>
    /// Represents implementation of <see cref="ExceptionLogger"/>.
    /// </summary>
    public class UnhandledExceptionLogger : ExceptionLogger
    {
        private readonly ILogger _log;

        public UnhandledExceptionLogger(ILogger log)
        {
            _log = log;
        }

        /// <summary>
        /// Overrides <see cref="ExceptionLogger.LogAsync"/> method with custom logger implementations.
        /// </summary>
        /// <param name="context">Instance of <see cref="ExceptionLoggerContext"/>.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns></returns>
        public override async Task LogAsync(ExceptionLoggerContext context, CancellationToken cancellationToken)
        {
            // Use a logger of your choice to log a request.
            var request = await CreateRequest(context.Request);
            
            _log.Error(context.Exception, "An unhanded exception occurred.", request);
        }

        private static async Task<HttpRequestModel> CreateRequest(HttpRequestMessage message)
        {
            var request = new HttpRequestModel
            {
                Body = await message.Content.ReadAsStringAsync(),
                Method = message.Method.Method,
                Scheme = message.RequestUri.Scheme,
                Host = message.RequestUri.Host,
                Protocol = string.Empty,
                PathBase = message.RequestUri.PathAndQuery,
                Path = message.RequestUri.AbsoluteUri,
                QueryString = message.RequestUri.Query
            };

            return request;
        }
    }
}