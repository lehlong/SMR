﻿using DMS.CORE.Common;
using DMS.CORE.Entities.AD;
using DMS.CORE.Entities.MD;
using DMS.CORE.Entities.MT;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DMS.CORE
{
    public class AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor httpContextAccessor) : DbContext(options)
    {
        public IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyAllConfigurations();
            foreach (var type in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(ISoftDeleteEntity).IsAssignableFrom(type.ClrType))
                    modelBuilder.SetSoftDeleteFilter(type.ClrType);
            }

            modelBuilder.HasSequence<int>("ORDER_SEQUENCE")
                    .StartsAt(1)
                    .IncrementsBy(1);

            base.OnModelCreating(modelBuilder);
        }

        public Func<DateTime> TimestampProvider { get; set; } = ()
            => DateTime.Now;

        public override int SaveChanges()
        {
            TrackChanges();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            TrackChanges();
            return await base.SaveChangesAsync(cancellationToken);
        }
        public string GetUserRequest()
        {
            var tokens = _httpContextAccessor?.HttpContext?.Request?.Headers.Authorization.ToString()?.Split(" ")?.ToList();
            string? user = null;
            if (tokens != null)
            {
                var token = tokens.FirstOrDefault(x => x != "Bearer");
                if (!string.IsNullOrWhiteSpace(token) && token != "null")
                {
                    JwtSecurityTokenHandler tokenHandler = new();
                    JwtSecurityToken securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
                    var claim = securityToken.Claims;
                    var result = claim.FirstOrDefault(x => x.Type == ClaimTypes.Name);
                    user = result?.Value;
                }
            }
            return user;
        }

        private void TrackChanges()
        {
            var user = GetUserRequest();

            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
            {
                if (entry.Entity is IBaseEntity auditable)
                {
                    if (entry.State == EntityState.Added)
                    {
                        auditable.CreateBy = user;
                        auditable.CreateDate = TimestampProvider();
                    }
                    else
                    {
                        Entry(auditable).Property(x => x.CreateBy).IsModified = false;
                        Entry(auditable).Property(x => x.CreateDate).IsModified = false;
                        auditable.UpdateBy = user;
                        auditable.UpdateDate = TimestampProvider();
                    }
                }
            }

            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Deleted))
            {
                if (entry.Entity is ISoftDeleteEntity deletedEntity)
                {
                    entry.State = EntityState.Unchanged;
                    deletedEntity.IsDeleted = true;
                    deletedEntity.DeleteBy = user;
                    deletedEntity.DeleteDate = TimestampProvider();
                }
            }
        }

        public async Task<int> GetNextSequenceValue(string sequence)
        {
            using var command = Database.GetDbConnection().CreateCommand();
            command.CommandText = $"SELECT {sequence}.NEXTVAL FROM DUAL";
            await Database.OpenConnectionAsync();
            using var result = await command.ExecuteReaderAsync();
            await result.ReadAsync();
            return result.GetInt32(0);
        }

        #region System Manage
        public DbSet<TblAdConfigTemplate> TblAdConfigTemplate { get; set; }

        public DbSet<TblAdAccount> TblAdAccount { get; set; }
        public DbSet<TblAdAccountGroup> TblAdAccountGroup { get; set; }
        public DbSet<TblAdMenu> TblAdMenu { get; set; }
        public DbSet<TblAdRight> TblAdRight { get; set; }
        public DbSet<TblAdMessage> TblAdMessage { get; set; }
        public DbSet<TblAdAccountGroupRight> TblAdAccountGroupRight { get; set; }
        public DbSet<TblAdAccountRefreshToken> TblAdAccountRefreshToken { get; set; }
        public DbSet<TblAdAppVersion> TblAdAppVersion { get; set; }
        public DbSet<TblAdAccount_AccountGroup> TblAdAccount_AccountGroup { get; set; }
        public DbSet<TblActionLog> TblActionLogs {get; set;}
        public DbSet<TblAdSystemTrace> TblAdSystemTrace { get; set; }
        public DbSet<tblAdOrganize> tblAdOrganize { get; set; }
        #endregion

        #region Master Data
        public DbSet<TblMdDeviceType> TblMdDeviceType { get; set; }
        public DbSet<TblMdRoom> TblMdRoom { get; set; }
        public DbSet<TblMdRoomDevice> TblMdRoomDevice { get; set; }


        public DbSet<TblMdAccountType> tblMdAccountType { get; set; }
        public DbSet<TblMdDevice> tblMdDevice { get; set; }
        #endregion

        #region Meeting
        public DbSet<TblMtMeetingFile> TblMtMeetingFile { get; set; }
        public DbSet<TblMtMeeting> TblMtMeeting { get; set; }
        public DbSet<TblMtMeetingResource> TblMtMeetingResource { get; set; }
        #endregion

    }
}
