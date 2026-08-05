using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Account;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register ([FromBody] RegisterDto registerDto)
        {
            try
            {
                if(!ModelState.IsValid)
                    return BadRequest(ModelState);

                var appUser = new AppUser
                {
                    UserName = registerDto.Email,
                    Email = registerDto.Email,
                    YourName = registerDto.YourName,
                    YourPartnerName = registerDto.YourPartnerName,
                    WeddingDate = registerDto.WeddingDate,
                    CreatedAt = DateTime.UtcNow
                };

                var createdUser = await _userManager.CreateAsync(appUser, registerDto.Password);

                if (createdUser.Succeeded)
                {
                    return Ok(new NewUserDto
                    {
                        Email = appUser.Email,
                        YourName = appUser.YourName,
                        Token = _tokenService.CreateToken(appUser)
                    });
                } 
                else
                {
                    return BadRequest(createdUser.Errors);
                }

            } catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login ([FromBody] LoginDto loginDto)
        {
           if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var appUser = await _userManager.FindByEmailAsync(loginDto.Email);

            if (appUser == null)
            {
                return Unauthorized("Invalid email or password.");
            }
            
            var passwordCorrect = await _userManager.CheckPasswordAsync(appUser, loginDto.Password);

            if (!passwordCorrect)
            {
                return Unauthorized ("Invalid email or password.");
            }

            return Ok (new NewUserDto
            {
                Email = appUser.Email,
                YourName = appUser.YourName,
                Token = _tokenService.CreateToken(appUser)
            });
        }
        
    }
}