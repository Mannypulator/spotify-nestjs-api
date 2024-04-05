import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { CreatePlayListDto } from './dto/create-playlist-dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playListRepo: Repository<Playlist>,

    @InjectRepository(Song)
    private songsRepo: Repository<Song>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(playlistDTO: CreatePlayListDto): Promise<Playlist> {
    const playlist = new Playlist();
    playlist.name = playlistDTO.name;

    const songs = await this.songsRepo.findBy(playlistDTO.songs);
    playlist.songs = songs;

    const user = await this.usersRepo.findOneBy({ id: playlistDTO.user });
    playlist.user = user;

    return await this.playListRepo.save(playlist);
  }
}
