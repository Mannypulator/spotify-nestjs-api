import { Body, Controller, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './playlist.entity';
import { CreatePlayListDto } from './dto/create-playlist-dto';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistService: PlaylistsService) {}

  @Post()
  create(@Body() playlistDTO: CreatePlayListDto): Promise<Playlist> {
    return this.playlistService.create(playlistDTO);
  }
}
