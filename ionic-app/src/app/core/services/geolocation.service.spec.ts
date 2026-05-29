import { TestBed } from '@angular/core/testing';
import { GeolocationService } from './geolocation.service';
import { GEOLOCATION_PLUGIN } from '@core/tokens/geolocation.token';

const mockGeoPosition = {
  coords: {
    latitude: 40.4168,
    longitude: -3.7038,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    course: null,
    speedAccuracy: null,
  },
  timestamp: Date.now(),
};

describe('GeolocationService', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({
      providers: [
        GeolocationService,
        { provide: GEOLOCATION_PLUGIN, useValue: { getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.resolveTo(mockGeoPosition) } },
      ],
    });
    const service = TestBed.inject(GeolocationService);
    expect(service).toBeTruthy();
  });

  describe('getCurrentPosition', () => {
    describe('on success', () => {
      let geoSpy: jasmine.Spy;

      beforeEach(() => {
        geoSpy = jasmine.createSpy('getCurrentPosition').and.resolveTo(mockGeoPosition);
        TestBed.configureTestingModule({
          providers: [
            GeolocationService,
            { provide: GEOLOCATION_PLUGIN, useValue: { getCurrentPosition: geoSpy } },
          ],
        });
      });

      it('should return latitude and longitude', async () => {
        const service = TestBed.inject(GeolocationService);
        const result = await service.getCurrentPosition();
        expect(result).toEqual({ latitude: 40.4168, longitude: -3.7038 });
      });

      it('should call getCurrentPosition with correct options', async () => {
        const service = TestBed.inject(GeolocationService);
        await service.getCurrentPosition();
        expect(geoSpy).toHaveBeenCalledWith({ timeout: 10000, maximumAge: 0 });
      });
    });

    describe('on error', () => {
      let geoSpy: jasmine.Spy;

      beforeEach(() => {
        geoSpy = jasmine.createSpy('getCurrentPosition').and.rejectWith(new Error('Location unavailable'));
        TestBed.configureTestingModule({
          providers: [
            GeolocationService,
            { provide: GEOLOCATION_PLUGIN, useValue: { getCurrentPosition: geoSpy } },
          ],
        });
      });

      it('should return null', async () => {
        const service = TestBed.inject(GeolocationService);
        const result = await service.getCurrentPosition();
        expect(result).toBeNull();
      });

      it('should log error to console', async () => {
        const consoleSpy = spyOn(console, 'error').and.callThrough();
        const service = TestBed.inject(GeolocationService);
        await service.getCurrentPosition();
        expect(consoleSpy).toHaveBeenCalledWith('Geolocation error:', jasmine.any(Error));
      });
    });
  });
});