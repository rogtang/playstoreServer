const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () =>{
    it('should filter by genre', ()=> {
        return supertest(app)
            .get('/apps')
            .query({genres: 'puzzle'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body[0].Genres).to.include('Puzzle')
            })
    })
    it('should sort by rating', ()=>{
        return supertest(app)
            .get('/apps')
            .query({sort: 'rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
            expect(res.body).to.be.an('array');
            let i = 0;
            let sorted = true;
            while (sorted && i < res.body.length - 1) {
            // lower index[i] means it is higher rated 
              sorted = res.body[i].Rating >= res.body[i + 1].Rating;
              i++;
            }
            expect(sorted).to.be.true;
            })
    })
    it('should sort by app', ()=> {
        return supertest(app)
            .get('/apps')
            .query({sort: 'app'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i=0;
                let sorted = true;
                while (sorted && i < res.body.length - 1) {
                // lower index[i] comes earlier in the alphabet and array
                    sorted = sorted && res.body[i].App.toLowerCase() < res.body[i+1].App.toLowerCase();
                    i ++;
                } expect(sorted).to.be.true;
            })
    })
    it('should return array of all apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res=> {
                expect(res.body).to.be.an('array');
            })      
    })
    it('shhould be 400 if sort is incorrect', () => {
        return supertest(app)
        .get('/apps')
        .query({sort: 'some made up sort query'})
        .expect(400, 'Sort must be one of rating or app')
    })
})