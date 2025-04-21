using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Common;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeepSeekController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private const string ApiKey = "";
        public DeepSeekController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet("ChatDeepSeek")]
        public async Task<IActionResult> GenerateTextAsync([FromQuery] string prompt, string model = "google/gemma-3-12b-it:free")
        {
            var transferObject = new TransferObject();
            var requestBody = new
            {
                model,
                messages = new[]
            {
                new { role = "user", content = prompt }
            },
                temperature = 0.7,
                max_tokens = 1000
            };

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiKey);
            _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "https://sso.d2s.com.vn");
            _httpClient.DefaultRequestHeaders.Add("X-Title", "SMR");

            try
            {
                var response = await _httpClient.PostAsJsonAsync("https://openrouter.ai/api/v1/chat/completions", requestBody);
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"OpenRouter API error: {response.StatusCode} - {errorContent}");
                }
                using var responseStream = await response.Content.ReadAsStreamAsync();
                using var jsonDoc = await JsonDocument.ParseAsync(responseStream);

                var content = jsonDoc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                transferObject.Data = new ChatBotResponse
                {
                    Role = "DeepSeek",
                    Content = content,
                };
                return Ok(transferObject);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calling OpenRouter: {ex.Message}");
                throw;
            }
        }
    }

    public class ChatBotResponse
    {
        public string? Role { get; set; }
        public string? Content { get; set; }

    }
}
