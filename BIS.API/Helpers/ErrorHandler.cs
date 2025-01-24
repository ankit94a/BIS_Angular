//using BIS.Common.Helpers;
using Newtonsoft.Json;
using System.Net;

namespace InSync.Api.Helpers
{
    //public class ErrorHandler
    //{
    //    private readonly RequestDelegate _next;

    //    public ErrorHandler(RequestDelegate next)
    //    {
    //        _next = next;
    //    }

    //    public async Task Invoke(HttpContext context)
    //    {
    //        try
    //        {
    //            await _next(context);
    //        }
    //        catch (Exception error)
    //        {
    //            var response = context.Response;
    //            response.ContentType = "application/json";
    //            var responseModel = new Response<string>() { Succeeded = false, Message = error?.Message };

    //            switch (error)
    //            {
    //                //case ApiException e:
    //                //    // custom application error
    //                //    response.StatusCode = (int)HttpStatusCode.BadRequest;
    //                //    break;

    //                //case ValidationException e:
    //                //    // custom application error
    //                //    response.StatusCode = (int)HttpStatusCode.UnprocessableEntity;
    //                //    responseModel.Errors = e.Errors;
    //                //    break;

    //                case KeyNotFoundException e:
    //                    // not found error
    //                    response.StatusCode = (int)HttpStatusCode.NotFound;
    //                    break;

    //                default:
    //                    // unhandled error
    //                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
    //                    break;
    //            }

    //            var result = JsonConvert.SerializeObject(responseModel);

    //            await response.WriteAsync(result);
    //        }
    //    }
    //}

}
