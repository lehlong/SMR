using Common;
using DMS.API.AppCode.Enum;
using DMS.API.AppCode.Extensions;
using DMS.BUSINESS.Dtos.MD;
using DMS.BUSINESS.Services.MD;
using DMS.CORE.Entities.MD;
using DocumentFormat.OpenXml.Office.CustomUI;
using DocumentFormat.OpenXml.Office2013.Word;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DMS.API.Controllers.MD
{
    [Route("api/[controller]")]
    [ApiController]
    public class MeetingController(IMeetingService service) : ControllerBase
    {
        public readonly IMeetingService _service = service;

        [HttpGet("Search")]
        public async Task<IActionResult> Search([FromQuery] BaseFilter filter)
        {
            var transferObject = new TransferObject();
            var result = await _service.Search(filter);
            if (_service.Status)
            {
                transferObject.Data = result;
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0001", _service);
            }
            return Ok(transferObject);
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll([FromQuery] BaseMdFilter filter)
        {
            var transferObject = new TransferObject();
            var result = await _service.GetAll(filter);
            if (_service.Status)
            {
                transferObject.Data = result;
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0001", _service);
            }
            return Ok(transferObject);
        }
        [HttpGet("GetAllPeopleMeeting")]
        public async Task<IActionResult> GetAllPeopleMeeting([FromQuery] string HeaderId)
        {
            var transferObject = new TransferObject();
            var result = await _service.GetAllPeopleMeeting(HeaderId);
            if (_service.Status)
            {
                transferObject.Data = new
                {
                    People = result.People.ToList(),
                    File = result.Files.ToList()
                };
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0001", _service);
            }
            return Ok(transferObject);
        }

        [HttpGet("GetFile")]
        public async Task<IActionResult> GetFile([FromQuery] string HeaderId)
        {
            var transferObject = new TransferObject();
            var result = await _service.GetFile(HeaderId);
            if (_service.Status)
            {
                transferObject.Data = result;
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0001", _service);
            }
            return Ok(transferObject);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromForm] string meeting, [FromForm] string meetingPeople, [FromForm] List<IFormFile> fileData)
        {
            var meetingObj = JsonConvert.DeserializeObject<MeetingDto>(meeting);

            var meetingPeopleList = JsonConvert.DeserializeObject<List<MeetingPeopleDto>>(meetingPeople);
            var transferObject = new TransferObject();
            var result = await _service.Adddata(meetingObj, meetingPeopleList, fileData);



            if (_service.Status)
            {
                //transferObject.Data = result;
                transferObject.Status = true;
                transferObject.MessageObject.MessageType = MessageType.Success;
                transferObject.GetMessage("0100", _service);
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0101", _service);
            }
            return Ok(transferObject);
        }


        [HttpPut("Update")]
        public async Task<IActionResult> Update([FromForm] string meeting, [FromForm] string meetingPeople, [FromForm] List<IFormFile> fileData, [FromForm] string filelist)
        {
            var transferObject = new TransferObject();
            var meetingObj = JsonConvert.DeserializeObject<MeetingDto>(meeting);

            var meetingPeopleList = JsonConvert.DeserializeObject<List<MeetingPeopleDto>>(meetingPeople);
            await _service.UpdateDB(meetingObj, meetingPeopleList, fileData, filelist);

            if (_service.Status)
            {
                transferObject.Status = true;
                transferObject.MessageObject.MessageType = MessageType.Success;
                transferObject.GetMessage("0103", _service);
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0104", _service);
            }
            return Ok(transferObject);
        }
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete([FromRoute] string id)
        {
            var transferObject = new TransferObject();
            await _service.Delete(id);
            if (_service.Status)
            {
                transferObject.Status = true;
                transferObject.MessageObject.MessageType = MessageType.Success;
                transferObject.GetMessage("0105", _service);
            }
            else
            {
                transferObject.Status = false;
                transferObject.MessageObject.MessageType = MessageType.Error;
                transferObject.GetMessage("0106", _service);
            }
            return Ok(transferObject);
        }
    }
}
