import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialBusquedasComponent } from './historial-busquedas.component';
import { BusquedaHistoricaService } from '../../services/busqueda-historica.service';
import { of } from 'rxjs';

describe('HistorialBusquedasComponent', () => {
  let component: HistorialBusquedasComponent;
  let fixture: ComponentFixture<HistorialBusquedasComponent>;
  let mockService: jasmine.SpyObj<BusquedaHistoricaService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('BusquedaHistoricaService', ['obtenerHistoricoPorUsuario']);

    await TestBed.configureTestingModule({
      imports: [HistorialBusquedasComponent],
      providers: [
        { provide: BusquedaHistoricaService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialBusquedasComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load search history on init', () => {
    const mockData = [
      {
        id: 1,
        username: 'john_doe',
        engine: 'google_flights',
        origin: 'BOG',
        destination: 'MDE',
        departure_date: '2026-05-21',
        return_date: '2026-05-25',
        type: 2,
        adults: 1,
        currency: 'COP',
        language: 'es',
        country: 'co',
        cabin_class: 'economy',
        searched_at: '2026-05-20T18:31:16.347481'
      }
    ];

    mockService.obtenerHistoricoPorUsuario.and.returnValue(of(mockData));
    localStorage.setItem('usuario', 'john_doe');

    fixture.detectChanges();

    expect(component.busquedas.length).toBe(1);
    expect(mockService.obtenerHistoricoPorUsuario).toHaveBeenCalledWith('john_doe');
  });

  it('should format date correctly', () => {
    const date = '2026-05-20T18:31:16.347481';
    const formatted = component.formatearFecha(date);
    expect(formatted).toContain('2026');
  });

  it('should return correct trip type', () => {
    expect(component.getTipoBusqueda(1)).toBe('Ida y vuelta');
    expect(component.getTipoBusqueda(2)).toBe('Solo ida');
  });
});

