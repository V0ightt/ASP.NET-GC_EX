using ExpenseManager.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static AuthController;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userMgr;
    private readonly IConfiguration _cfg;

    public AuthController(UserManager<ApplicationUser> userMgr, IConfiguration cfg)
    {
        _userMgr = userMgr;
        _cfg = cfg;
    }

    public record LoginDto(string Email, string Password);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _userMgr.FindByEmailAsync(dto.Email);
        if (user == null || !await _userMgr.CheckPasswordAsync(user, dto.Password))
            return Problem(statusCode: 401, title: "Invalid credentials");

        // 1. build claims
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!)
        };

        var roles = await _userMgr.GetRolesAsync(user);
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        // 2. sign token
        var jwtCfg = _cfg.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtCfg["Key"]!));

        var token = new JwtSecurityToken(
            issuer: jwtCfg["Issuer"],
            audience: jwtCfg["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new { access_token = jwt, expires = token.ValidTo });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] LoginDto dto)
    {
        // very simple DTO reuse: dto.Email + dto.Password
        var exists = await _userMgr.FindByEmailAsync(dto.Email);
        if (exists != null)
            return Problem(statusCode: 409, title: "Email already registered");

        var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email };
        var create = await _userMgr.CreateAsync(user, dto.Password);

        if (!create.Succeeded)
        {
            // Fix: Create a ValidationProblemDetails object and pass it to ValidationProblem
            var validationProblemDetails = new ValidationProblemDetails(
                create.Errors.ToDictionary(e => e.Code, e => new[] { e.Description }));
            return ValidationProblem(validationProblemDetails);
        }

        // auto-login: issue token immediately
        // (could refactor token code to a helper, but inline for brevity)
        var jwtCfg = _cfg.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtCfg["Key"]!));

        var token = new JwtSecurityToken(
            issuer: jwtCfg["Issuer"],
            audience: jwtCfg["Audience"],
            claims: new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!)
            },
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return Ok(new { access_token = jwt, expires = token.ValidTo });
    }
}

