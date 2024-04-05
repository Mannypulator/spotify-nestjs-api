import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDTO } from './dto/create-song-dto';
import { UpdateSongDTO } from './dto/update-song-dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  private readonly songs = [];

  async create(songDTO: CreateSongDTO): Promise<Song> {
    const song = new Song();
    song.tittle = songDTO.title;
    song.artists = songDTO.artists;
    song.releasedDate = songDTO.releasedDate;
    song.duration = songDTO.duration;
    song.lyrics = songDTO.lyrics;

    const artists = await this.artistRepository.findBy(songDTO.artists);
    song.artists = artists;
    return await this.songRepository.save(song);
  }

  /**
   *  A description of the entire function.
   *
   *  @param {type} paramName - description of parameter
   *  @return {type} description of return value
   */

  async findAll(): Promise<Song[]> {
    return await this.songRepository.find();
  }

  findOne(id: number): Promise<Song> {
    return this.songRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.songRepository.delete(id);
  }

  update(id: number, recordToUpdate: UpdateSongDTO): Promise<UpdateResult> {
    return this.songRepository.update(id, recordToUpdate);
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    // Adding query builder
    //if you need to add query builder you can add it here
    const query = this.songRepository.createQueryBuilder('song');
    query.orderBy('song.id', 'ASC');
    return paginate<Song>(this.songRepository, options);
  }
}
